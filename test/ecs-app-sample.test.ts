import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { devParameter } from '../parameter'
import { EcsAppStack } from '../lib/stack/ecs-app-sample-stack'
import { Template } from 'aws-cdk-lib/assertions'

test(`Snapshot test for ECS App Stacks`, () => {
  const app = new App()
  const ecsapp = new EcsAppStack(app, 'Dev-EcsApp', {
    // Account and Region on test
    //  cdk.process.env.* returns undefined, and cdk.Stack.of(this).* returns ${Token[Region.4]} at test time.
    //  In such case, RegionInfo.get(cdk.Stack.of(this).region) returns error and test will fail.
    //  So we pass 'ap-northeast-1' as region code.
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
    },
    crossRegionReferences: true,
    tags: {
      Repository: 'aws-samples/baseline-environment-on-aws',
      Environment: devParameter.envName,
    },

    // from parameter.ts
    vpcCidr: devParameter.vpcCidr,
  })

  expect(Template.fromStack(ecsapp)).toMatchSnapshot()
})
