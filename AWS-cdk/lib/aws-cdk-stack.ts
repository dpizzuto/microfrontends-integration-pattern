import cdk = require('@aws-cdk/core');
import { CfnBucketPolicy, HttpMethods, Bucket } from '@aws-cdk/aws-s3';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bootstrapBucket = new Bucket(this, 'cdk-micro-frontend-bootstrap');
    bootstrapBucket.grantPublicAccess;

    //Angular Bucket 
const angularBucket = new Bucket(this, 'cdk-micro-frontend-angular');
angularBucket.addCorsRule({
    allowedHeaders: ['authorization'],
    allowedMethods: [HttpMethods.GET],
    allowedOrigins: [bootstrapBucket.bucketWebsiteUrl],
    maxAge: 3600
});

//React bucket
const reactBucket = new Bucket(this, 'cdk-micro-frontend-react');
angularBucket.addCorsRule({
    allowedHeaders: ['authorization'],
    allowedMethods: [HttpMethods.GET],
    allowedOrigins: [bootstrapBucket.bucketWebsiteUrl],
    maxAge: 3600
});
  }
}

