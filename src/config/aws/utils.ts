import { nanoid } from 'nanoid';
import { awsS3 } from './aws-sdk.config';
import * as config from 'config';

const awsConfig = config.get('aws');

export const uploadSignedUrl = async (
  fileType: string,
  mimeType: string,
): Promise<{
  signedUrl: string;
  key: string;
  fileType: string;
  mimeType: string;
}> => {
  const key = `${nanoid()}.${fileType}`;
  const params = {
    Bucket: awsConfig.bucket,
    Key: key,
    Expires: 120,
    ContentType: mimeType,
  };

  const signedUrl = await awsS3.getSignedUrl('putObject', params);

  return { signedUrl, key, fileType, mimeType };
};

export const downloadSignedUrl = async (key: string): Promise<string> => {
  const params = {
    Bucket: awsConfig.bucket,
    Key: key,
    Expires: 120,
  };

  const signedUrl = await awsS3.getSignedUrl('getObject', params);

  return signedUrl;
};
