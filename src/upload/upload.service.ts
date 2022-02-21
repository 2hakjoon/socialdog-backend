import { FileUpload } from 'graphql-upload';
import  * as AWS  from 'aws-sdk'
import { IUploadModule } from './upload.interface';
import { Inject } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/constants';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';


export class UploadService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options:IUploadModule,
  ){
  }

  private s3 = new AWS.S3({
    accessKeyId: this.options.accessKeyId,
    secretAccessKey: this.options.secretAccessKey
  })

  async uploadFileToS3 (file:FileUpload):Promise<string> {
    console.log(file)
    
    // Setting up S3 upload parameters
    const params = {
          Bucket: this.options.s3Bucket,
          Key: "userPhoto/"+file.filename, // File name you want to save as in S3
          Body: file.createReadStream(),
          ACL: 'public-read'
        };

    try{
      const res = await this.s3.upload(params).promise();
      return res.Location
    }
    catch(e){
      throw new Error("s3 업로드 에러")
    }
  }

  async deleteFileAtS3 (url:string) {
    const filename = url.split('https://socialdog.s3.ap-northeast-2.amazonaws.com/')[1]
    console.log(filename)
    try{
    const params = {
        Bucket: this.options.s3Bucket,
        Key: filename, // File name you want to save as in S3
      }
      await this.s3.deleteObject(params).promise();
      return;
    }
    catch(e){
      throw new Error("s3 삭제 에러")
    }
  }

  async uploadFilesToS3 (file:FileUpload):Promise<string> {
    console.log(file)
    
    const params = {
          Bucket: this.options.s3Bucket,
          Key: "userPhoto/"+file.filename,
          Body: file.createReadStream(),
          ACL: 'public-read'
        };

    try{
      const res = await this.s3.upload(params).promise();
      return res.Location
    }
    catch(e){
      throw new Error("s3 업로드 에러")
    }
  }
}