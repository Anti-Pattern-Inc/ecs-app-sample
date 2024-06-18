import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { Networking } from '../construct/networking'
import { Ecs } from '../construct/ecs'

export interface EcsAppStackProps extends StackProps {
  vpcCidr: string
}

export class EcsAppStack extends Stack {
  constructor(scope: Construct, id: string, props: EcsAppStackProps) {
    super(scope, id, props)

    const { vpc } = new Networking(this, 'Networking', {
      vpcCidr: props.vpcCidr,
    })

    new Ecs(this, 'Ecs', {
      vpc,
    })
  }
}
