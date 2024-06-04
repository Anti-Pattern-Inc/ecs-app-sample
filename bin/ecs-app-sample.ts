import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { devParameter } from '../parameter'
import { EcsAppStack } from '../lib/stack/ecs-app-sample-stack'
const app = new App()

new EcsAppStack(app, 'Dev-EcsApp', {
  description: 'ECS App sample',
  env: {
    account: devParameter.env?.account || process.env.CDK_DEFAULT_ACCOUNT,
    region: devParameter.env?.region || process.env.CDK_DEFAULT_REGION,
  },
  crossRegionReferences: true,
  tags: {
    Repository: 'aws-samples/baseline-environment-on-aws',
    Environment: devParameter.envName,
  },

  // from parameter.ts
  vpcCidr: devParameter.vpcCidr,
})
