import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { Networking } from '../construct/networking'
import { Ec2 } from '../construct/ec2'

export interface EcsAppStackProps extends StackProps {
  vpcCidr: string
}

export class EcsAppStack extends Stack {
  constructor(scope: Construct, id: string, props: EcsAppStackProps) {
    super(scope, id, props)

    const { vpc } = new Networking(this, 'Networking', {
      vpcCidr: props.vpcCidr,
    })

    new Ec2(this, 'Ec2', {
      vpc,
    })
  }
}
