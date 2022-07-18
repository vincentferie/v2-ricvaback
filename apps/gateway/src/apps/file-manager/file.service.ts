import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    return s3
      .upload({
        Bucket: this.configService.get('awsPublicBucketName'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    // const newFile = this.publicFilesRepository.create({
    //   key: uploadResult.Key,
    //   url: uploadResult.Location
    // });
    // await this.publicFilesRepository.save(newFile);
    // return newFile;
  }
}
