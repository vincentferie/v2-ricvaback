import {
  MulterModuleAsyncOptions,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { docFileFilter, editFileName } from '../helpers/utils';

export const MulterLocalDisk = async (
  config: ConfigService,
  path: string,
): Promise<MulterModuleOptions> => ({
  dest: config.get<string>('uploadDir'),
  storage: diskStorage({
    destination: `${config.get<string>('uploadDir')}/${path}`,
    filename: editFileName,
  }),
  limits: { fileSize: config.get<number>('fileUploadedSize') },
  fileFilter: docFileFilter,
});

export const MulterAWS3Cloud = async (
  config: ConfigService,
  path: string,
): Promise<MulterModuleOptions> => ({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: config.get<string>('awsPublicBucketName'),
    acl: 'public-read-write', //'public-read',
    key: editFileName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (_req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    //limits: config.get<number>('fileUploadedSize'),
    //location: {url : `${config.get<string>('uploadDir')}/${path}`},
  }),
  fileFilter: docFileFilter,
  limits: { fileSize: config.get<number>('fileUploadedSize') },
});
