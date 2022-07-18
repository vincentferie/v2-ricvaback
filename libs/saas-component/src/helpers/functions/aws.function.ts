import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

export const uploadFile = async (
  dataBuffer: Buffer,
  filename: string,
  config: ConfigService,
) => {
  const s3 = new S3();
  // return s3.upload({
  //   Bucket: config.get('awsPublicBucketName'),
  //   Body: dataBuffer,
  //   Key: `${uuidv4()}-${filename}`
  // }).promise();
  const params = {
    Bucket: config.get('awsPublicBucketName'),
    Body: dataBuffer,
    Key: `${uuidv4()}-${filename}`,
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        Logger.error(err);
        reject(err.message);
      }
      resolve(data);
    });
  });
};

export const deleteFile = async (file: any, config: ConfigService) => {
  const s3 = new S3();
  const params = {
    Bucket: config.get('awsPublicBucketName'),
    Key: file.key,
  };
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        Logger.error(err);
        reject(err.message);
      }
      resolve(data);
    });
  });
  // return s3.deleteObject({
  //   Bucket: config.get('awsPublicBucketName'),
  //   Key: file.key,
  // }).promise();
};

export const getS3 = async () => {
  return new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
};
