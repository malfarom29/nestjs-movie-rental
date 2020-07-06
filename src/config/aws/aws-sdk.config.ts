import * as AWS from 'aws-sdk';
require('dotenv').config();

export const awsS3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  useAccelerateEndpoint: true,
  signatureVersion: 'v4',
  region: 'us-east-2',
});
