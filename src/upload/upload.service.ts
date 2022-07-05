import { FileUpload } from 'graphql-upload';
import * as AWS from 'aws-sdk';
import { IUploadModule } from './upload.interface';
import { Inject } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/utils/constants';
import {
  CreatePreSignedUrlsInputDto,
  CreatePreSignedUrlsOutputDto,
} from './dtos/create-presigned-url.dto';

export class UploadService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: IUploadModule,
  ) {}

  private s3 = new AWS.S3({
    accessKeyId: this.options.accessKeyId,
    secretAccessKey: this.options.secretAccessKey,
    region: this.options.region,
  });

  async uploadFileToS3(dir: string, file: FileUpload): Promise<string> {
    console.log(file);
    const params = {
      Bucket: this.options.s3Bucket,
      Key: dir + Date.now() + '_' + file.filename,
      Body: file.createReadStream(),
      ACL: 'public-read',
    };

    try {
      const res = await this.s3.upload(params).promise();
      return res.Location;
    } catch (e) {
      throw new Error('s3 업로드 에러');
    }
  }

  async deleteFileAtS3(url: string) {
    const filename = url.split(
      'https://socialdog.s3.ap-northeast-2.amazonaws.com/',
    )[1];
    try {
      const params = {
        Bucket: this.options.s3Bucket,
        Key: filename,
      };
      await this.s3.deleteObject(params).promise();
      return;
    } catch (e) {
      throw new Error('s3 삭제 에러');
    }
  }

  async getPreSignUrls({
    files,
  }: CreatePreSignedUrlsInputDto): Promise<CreatePreSignedUrlsOutputDto> {
    const promiseUrls = await files.map(async (file) => {
      const params = {
        Bucket: this.options.s3Bucket,
        Key: file.filename,
        ContentType: file.fileType,
        Expires: 60,
        ACL: 'public-read',
      };
      return this.s3.getSignedUrlPromise('putObject', params);
    });

    const preSignedUrl = await Promise.all(promiseUrls).catch(() => {
      throw new Error('s3 업로드 에러');
    });
    return {
      ok: true,
      urls: preSignedUrl,
    };
  }

  async uploadFilesToS3(
    dir: string,
    files: Promise<FileUpload>[],
  ): Promise<string[]> {
    const promiseFiles = [];
    for (let i = 0; i < files.length; i++) {
      promiseFiles.push(await this.uploadFileToS3(dir, await files[i]));
    }
    await Promise.all(promiseFiles).catch(function (err) {
      throw new Error('s3 업로드 에러');
    });
    console.log(promiseFiles);
    return promiseFiles;
  }
}
