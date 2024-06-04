# ECS CDK Sample

このリポジトリは[bleaのusecases/blea-guest-ecs-app-sample](https://github.com/aws-samples/baseline-environment-on-aws/tree/main/usecases/blea-guest-ecs-app-sample)をもとに作られています

## 初期設定
- `npm install`
- CDK実行先となるAWSアカウントの認証情報を設定
  - 例: SSO画面の*Access Keys*からコピペし環境変数に設定
- `npx aws-cdk bootstrap`
  - 対象のアカウント・リージョンへCDKの初期設定がされます

## デプロイ
- `npx aws-cdk deploy`

## 環境削除
- `npx aws-cdk destroy`

## 開発
- このリポジトリは、基本的なネットワークの構成のみが準備されています。必要なサービスを調べながら実装してください
- [CDKのドキュメント](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html)や[公式のガイド](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/ecs_example.html)の説明が詳しいです
- [blea](https://github.com/aws-samples/baseline-environment-on-aws/tree/main)の[usecases/blea-guest-ecs-app-sample](https://github.com/aws-samples/baseline-environment-on-aws/tree/main/usecases/blea-guest-ecs-app-sample)が実装の参考になります

## 資材の説明
- `bin`
  - CDKのエントリポイントとなるファイルを置きます
  - パラメータはここで渡すことが多いです
- `lib/construct`
  - 各サービスの`Construct`を定義します
- `lib/stack`
  - CloudFormationのStackを定義します
  - このリポジトリでは`ecs-app-sample-stack.ts`のみを使用し、この中でConstructを読み込みます
- `test`
  - CDKが自動で実行するテストです
  - パラメータなどが足りないとエラーになります
- `parameter.ts`
  - CDKで使うパラメータを定義します
  - このリポジトリでは`devParameter`のみですが、ステージングや本番環境用にパラメータを定義することがあります
