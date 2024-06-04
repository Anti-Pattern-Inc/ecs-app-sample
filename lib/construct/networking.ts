import * as cdk from 'aws-cdk-lib'
import {
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_kms as kms,
  aws_s3 as s3,
} from 'aws-cdk-lib'
import { IpAddresses } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

export interface NetworkingProps {
  vpcCidr: string
}

export class Networking extends Construct {
  public readonly vpc: ec2.Vpc

  constructor(scope: Construct, id: string, props: NetworkingProps) {
    super(scope, id)

    const vpc = new ec2.Vpc(this, 'Vpc', {
      ipAddresses: IpAddresses.cidr(props.vpcCidr),
      maxAzs: 2,
      natGateways: 1,
      flowLogs: {},
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 22,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 22,
          name: 'Protected',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    })

    //  --------------------------------------------------------------
    //  Bucket for VPC Flow log

    // CMK
    const flowLogKey = new kms.Key(this, 'Key', {
      enableKeyRotation: true,
      description: 'CMK for EcsApp VPC Flow Logs',
      alias: cdk.Names.uniqueResourceName(this, {}),
    })
    flowLogKey.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: [
          'kms:Encrypt*',
          'kms:Decrypt*',
          'kms:ReEncrypt*',
          'kms:GenerateDataKey*',
          'kms:Describe*',
        ],
        principals: [new iam.ServicePrincipal('delivery.logs.amazonaws.com')],
        resources: ['*'],
      })
    )

    // Bucket
    const flowLogBucket = new s3.Bucket(this, 'FlowLogBucket', {
      accessControl: s3.BucketAccessControl.PRIVATE,
      encryptionKey: flowLogKey,
      encryption: s3.BucketEncryption.KMS,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      enforceSSL: true,
    })

    vpc.addFlowLog('FlowLogs', {
      destination: ec2.FlowLogDestination.toS3(flowLogBucket),
      trafficType: ec2.FlowLogTrafficType.ALL,
    })
    this.vpc = vpc

    //  --------------------------------------------------------------

    // NACL for Public Subnets
    const publicNacl = new ec2.NetworkAcl(this, 'PublicNacl', {
      vpc: vpc,
      subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
    })

    // Egress Rules for Public Subnets
    publicNacl.addEntry('PublicEgress', {
      direction: ec2.TrafficDirection.EGRESS,
      ruleNumber: 100,
      cidr: ec2.AclCidr.anyIpv4(),
      traffic: ec2.AclTraffic.allTraffic(),
      ruleAction: ec2.Action.ALLOW,
    })

    // Ingress Rules for Public Subnets
    publicNacl.addEntry('PublicIngress', {
      direction: ec2.TrafficDirection.INGRESS,
      ruleNumber: 100,
      cidr: ec2.AclCidr.anyIpv4(),
      traffic: ec2.AclTraffic.allTraffic(),
      ruleAction: ec2.Action.ALLOW,
    })

    // NACL for Private Subnets
    const privateNacl = new ec2.NetworkAcl(this, 'PrivateNacl', {
      vpc: vpc,
      subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    })

    // Egress Rules for Private Subnets
    privateNacl.addEntry('PrivateEgress', {
      direction: ec2.TrafficDirection.EGRESS,
      ruleNumber: 100,
      cidr: ec2.AclCidr.anyIpv4(),
      traffic: ec2.AclTraffic.allTraffic(),
      ruleAction: ec2.Action.ALLOW,
    })

    // Ingress Rules for Public Subnets
    privateNacl.addEntry('PrivateIngress', {
      direction: ec2.TrafficDirection.INGRESS,
      ruleNumber: 120,
      cidr: ec2.AclCidr.anyIpv4(),
      traffic: ec2.AclTraffic.allTraffic(),
      ruleAction: ec2.Action.ALLOW,
    })
  }
}
