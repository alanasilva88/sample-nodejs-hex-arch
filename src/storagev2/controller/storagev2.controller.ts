import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageV2Service } from '../service/storagev2.service';

@Controller('api/v1/storagev2/uploads')
export class StorageV2Controller {
  constructor(private readonly storageService: StorageV2Service) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucketName') bucketName: string,
    @Body('existingFileUrl') existingFileUrl?: string,
  ) {
    const fileUrl = await this.storageService.uploadFile(file, bucketName, existingFileUrl);
    return { fileUrl };
  }

  @Post('delete')
  async deleteFile(
    @Body('bucketName') bucketName: string,
    @Body('fileName') fileName: string,
  ) {
    await this.storageService.deleteFile(bucketName, fileName);
    return { message: `Arquivo "${fileName}" excluído com sucesso.` };
  }

  @Post('replace')
  @UseInterceptors(FileInterceptor('file'))
  async replaceFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucketName') bucketName: string,
    @Body('existingFileUrl') existingFileUrl: string,
  ) {
    const fileUrl = await this.storageService.replaceFile(file, bucketName, existingFileUrl);
    return { fileUrl };
  }

}
