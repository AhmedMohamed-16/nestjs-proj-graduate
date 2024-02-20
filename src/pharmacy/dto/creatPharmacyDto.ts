import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class creatPharmacyDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsNumberString()
  phone: string;

  @IsNumber()
  license: number;

  @IsString()
  country: string;
  @IsString()
  government: string;

  @IsString()
  regeion: string;
  @IsString()
  address: string;

  @IsString()
  pharmacistFName: string;
  @IsString()
  pharmacistLName: string;
  @IsString()
  pharmacistPhone: string;

  @IsString()
  pharmacistEmail: string;

  image: string;
  commercialRegistration: string;
}

export class updatePharmacyDto extends PartialType(creatPharmacyDto) {}
