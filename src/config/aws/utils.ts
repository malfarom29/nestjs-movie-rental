import { nanoid } from 'nanoid';
import { awsS3 } from './aws-sdk.config';
require('dotenv').config();

const bucket = process.env.AWS_BUCKET;

export const uploadSignedUrl = async (
  fileType: string,
  mimeType: string,
): Promise<{
  signedUrl: string;
  key: string;
  fileType: string;
  mimeType: string;
}> => {
  const key = nanoid();
  const params = {
    Bucket: bucket,
    Key: `${key}.${fileType}`,
    Expires: 120,
    ContentType: mimeType,
  };

  const signedUrl = await awsS3.getSignedUrl('putObject', params);

  return { signedUrl, key, fileType, mimeType };
};

export const downloadSignedUrl = async (key: string): Promise<string> => {
  const params = {
    Bucket: bucket,
    Key: key,
    Expires: 120,
  };

  const signedUrl = await awsS3.getSignedUrl('getObject', params);

  return signedUrl;
};
