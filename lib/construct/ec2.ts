import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export interface Ec2Props {
  vpc: ec2.Vpc
}

export class Ec2 extends Construct {
  constructor(scope: Construct, id: string, props: Ec2Props) {
    super(scope, id)

    new ec2.Instance(this, 'MyInstance', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
      }),
    })
  }
}
