import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';

import { CheckAbility } from 'src/auth/decorators/authorize.decorator';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { JwtAuthGaurd } from 'src/auth/guards/jwt-authguard';
import { Pharmacy } from './entities/pharmacy.entity';
import { PharmacyService } from './pharmacy.service';
import { Action } from 'src/apility/abiliti-factory/abiliti-factory';
import { creatPharmacyDto, updatePharmacyDto } from './dto/creatPharmacyDto';
import { creatPharmacisDto } from './dto/createPharmacistDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private PharmacyService: PharmacyService) {}

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Manage, subject: Pharmacy })
  @Get('')
  async getAll(): Promise<any> {
    return await this.PharmacyService.findAll();
  }
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: Pharmacy })
  @Post('getPharmacist')
  async getAllPharmacist(@Body('email') email: string): Promise<any> {
    return await this.PharmacyService.findByPharmacistEmail(email);
  }

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: Pharmacy })
  @Post('get')
  async findByEmailAndPass(@Body() updatePharmacyDto: updatePharmacyDto) {
    return await this.PharmacyService.validatePharmacy(
      updatePharmacyDto.license,
      updatePharmacyDto.password,
    );
  }
  // @UseGuards(JwtAuthGaurd, AbilityGuard)
  // @CheckAbility({ action: Action.Create, subject: Pharmacy })
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
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
  createAdmin(
    @UploadedFile() file,
    @Body() creatPharmacyDto: creatPharmacyDto,
  ): any {
    console.log(file);
    creatPharmacyDto.image = file.filename;
    console.log(creatPharmacyDto);
    return this.PharmacyService.create(creatPharmacyDto);
  }
  @Get('get/:imagNmae')
  async gitImagePharmacy(@Param('imagNmae') name: string, @Res() res) {
    return res.sendFile(join(process.cwd(), `uploads/${name}`));
  }

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Update, subject: Pharmacy })
  @Put(':id')
  updateAdmin(
    @Param('id') id: number,
    @Body() updatePharmacyDto: updatePharmacyDto,
  ) {
    return this.PharmacyService.update(id, updatePharmacyDto);
  }
  //
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Delete, subject: Pharmacy })
  @Delete(':id')
  deleteAdmin(@Param('id') id: number) {
    return this.PharmacyService.delete(id);
  }
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: Pharmacy })
  @Get(':id')
  async findByIdAdmin(@Param('id') id: number): Promise<any> {
    return await this.PharmacyService.findById(id);
  }
}
