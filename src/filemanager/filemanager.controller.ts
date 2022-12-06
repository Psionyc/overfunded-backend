import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage, Multer } from 'multer';
import { extname } from 'path';
import { Success } from 'src/shared';
import { FilemanagerService } from './filemanager.service';

@Controller('files')
export class FilemanagerController {
  constructor(private readonly filemanagerService: FilemanagerService) {}

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  upload(@UploadedFile() file) {
    return Success<string>({
      message: 'Uploaded a file successfully',
      result: file.filename,
    });
  }

  @Get('/:imgPath')
  download(@Param('imgPath') imgPath, @Res() res: Response) {
    res.sendFile(imgPath, { root: 'uploads' });
  }

  @Post('create-metadata')
  createMetadata(@Body('image') image: string) {
    return this.filemanagerService.createNewMetadataEntity(image);
  }
}
