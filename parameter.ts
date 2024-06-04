import { Environment } from 'aws-cdk-lib'

// Parameters for Application
export interface AppParameter {
  env?: Environment
  envName: string
  vpcCidr: string

  // -- Sample to use custom domain on CloudFront
  // hostedZoneId: string;
  // domainName: string;
  // cloudFrontHostName: string;
}

// Parameters for Dev Account
export const devParameter: AppParameter = {
  env: {
    // account: '111111111111',
    region: 'ap-northeast-1',
  },
  envName: 'Development',
  vpcCidr: '10.100.0.0/16',

  // -- Sample to use custom domain on CloudFront
  // hostedZoneId: 'Z00000000000000000000',
  // domainName: 'example.com',
  // cloudFrontHostName: 'www',
}
