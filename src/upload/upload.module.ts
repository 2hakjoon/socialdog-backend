import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/constants';
import { IUploadModule } from './upload.interface';
import { UploadService } from './upload.service';

@Module({})
@Global()
export class UploadModule {
  static forRoot(options:IUploadModule): DynamicModule {
    return {
      module: UploadModule,
      exports: [UploadService],
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }, UploadService],
    };
  }
}
