import * as AWS from 'aws-sdk';
import * as config from 'config';

const awsConfig = config.get('aws');

export const awsS3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || awsConfig.accessKeyId,
  secretAccessKey:
    process.env.AWS_ACCESS_KEY_SECRET || awsConfig.accessKeySecret,
  useAccelerateEndpoint: true,
  signatureVersion: 'v4',
  region: 'us-east-2',
});
