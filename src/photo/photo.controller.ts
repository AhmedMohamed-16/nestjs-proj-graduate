import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Res,
  Param,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGaurd } from 'src/auth/guards/jwt-authguard';

@Controller('photo')
export class PhotoController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          //gie file.originalname without extension

          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file, @Req() req) {
    // const user = req.user;
    console.log(file);
    return {
      url: file.path,
    };
  }

  @Get('get/:imagNmae')
  async gitImagePharmacy(@Param('imagNmae') name: string, @Res() res) {
    return res.sendFile(join(process.cwd(), `uploads/${name}`));
  }
}
