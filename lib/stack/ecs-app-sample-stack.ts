import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { Networking } from '../construct/networking'

export interface EcsAppStackProps extends StackProps {
  vpcCidr: string
}

export class EcsAppStack extends Stack {
  constructor(scope: Construct, id: string, props: EcsAppStackProps) {
    super(scope, id, props)

    new Networking(this, 'Networking', {
      vpcCidr: props.vpcCidr,
    })
  }
}
