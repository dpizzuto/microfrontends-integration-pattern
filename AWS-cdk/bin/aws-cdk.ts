#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { AwsCdkStack } from '../lib/aws-cdk-stack';

const app = new cdk.App();
new AwsCdkStack(app, 'AwsCdkStack');