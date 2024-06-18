import {
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_elasticloadbalancingv2 as elb,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

export interface EcsProps {
  vpc: ec2.Vpc
}

export class Ecs extends Construct {
  constructor(scope: Construct, id: string, props: EcsProps) {
    super(scope, id)

    const cluster = new ecs.Cluster(this, 'FargateCluster', {
      vpc: props.vpc,
    })

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef')
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('nginx'),
      portMappings: [{ containerPort: 80 }],
    })

    const service = new ecs.FargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
    })

    const alb = new elb.ApplicationLoadBalancer(this, 'ALB', {
      vpc: props.vpc,
      internetFacing: true,
    })
    const listener = alb.addListener('Listener', { port: 80 })
    listener.addTargets('ECS', {
      port: 80,
      targets: [service],
    })
  }
}
