import {
  Controller,
  Request,
  UseGuards,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  Param,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { creatAdminDto, updateAdminDto } from 'src/admin/dto/creatAdminDto';
import { AdminService } from 'src/admin/admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RefreshJwtAuthGaurd } from './guards/refresh-jwt-authguard';
import { registerDto } from './dto/register.dto';
import { JwtAuthGaurd } from './guards/jwt-authguard';
import { AbilityGuard } from './guards/ability.guard';
import { CheckAbility } from './decorators/authorize.decorator';
import { Admin } from 'src/admin/entities/admin.entity';
import { Action } from 'src/apility/abiliti-factory/abiliti-factory';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}
  @UseInterceptors(
    FilesInterceptor('image', 2, {
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
  @Post('register')
  async register(
    @UploadedFiles() file: Array<Express.Multer.File>,
    @Body() user: registerDto,
  ) {
    if (file) {
      console.log(file);
      user.image = file[0].filename;
      user.commercialRegistration = file[1].filename;
    }

    return await this.AuthService.register(user);
  }

  @UseGuards(AuthGuard(['local-admin', 'local-pharmacy', 'local-store']))
  @Post('login')
  async login(@Request() req) {
    return await this.AuthService.login(req.user);
  }

  @UseGuards(RefreshJwtAuthGaurd)
  @Get('refreshToken') // ->>>>>>>table
  async refreshToken(@Request() req) {
    return await this.AuthService.refreshToken(req.user);
  }

  @Get('delete')
  async get(@Request() req) {
    return 'delete user';
  }
  @UseGuards(JwtAuthGaurd)
  @Get('forget-password/email')
  async forgetPassword(@Req() req) {
    const token = Math.random().toString(20).substring(2, 12);
    return await this.AuthService.forgetPassword(token, req.user);
  }

  @UseGuards(JwtAuthGaurd)
  @Post('reset-password/email/:token')
  async resetPassword(
    @Body() body: any,
    @Param('token') token: string,
    @Req() req,
  ) {
    return await this.AuthService.resetPassword(body, token, req.user);
  }
  //////////////////////////////////////
  // @Post('forget-password')
  // async forgetPassword(@Body() body: { phone: string }): Promise<void> {
  //   await this.AuthService.sendPasswordResetCode(body.phone);
  //   // Optionally, return a success response or a message indicating that the code has been sent
  // }

  // @Post('reset-password')
  // async resetPassword(
  //   @Body() body: { phoneNumber: string; code: string; newPassword: string },
  // ): Promise<string> {
  //   try {
  //     await this.AuthService.resetPassword(
  //       body.phoneNumber,
  //       body.code,
  //       body.newPassword,
  //     );
  //     return 'success';
  //   } catch (error) {
  //     return 'error';
  //   }
  // }
}
