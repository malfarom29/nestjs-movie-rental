import * as config from 'config';
import * as AWS from 'aws-sdk';

const awsConfig = config.get('aws');

export const awsS3 = new AWS.S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.accessKeySecret,
  useAccelerateEndpoint: true,
  signatureVersion: 'v4',
  region: 'us-east-2',
});
