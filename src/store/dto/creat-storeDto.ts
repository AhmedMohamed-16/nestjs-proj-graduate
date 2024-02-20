import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class creatStoreDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsNumberString()
  phone: string;

  @IsNumber()
  license: number;

  @IsString()
  companyName?: string;
  @IsString()
  country: string;
  @IsString()
  government: string;

  @IsString()
  regeion: string;
  @IsString()
  adress: string;

  @IsString()
  image: string;

  @IsString()
  email: string;
  @IsString()
  commercialRegistration: string;
}

export class updateStoreDto extends PartialType(creatStoreDto) {}
