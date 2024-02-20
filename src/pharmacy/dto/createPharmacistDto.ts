import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNumberString, IsString } from 'class-validator';

export class creatPharmacisDto {
  @IsString()
  fname: string;
  @IsString()
  lname: string;
  @IsString()
  phone: string;

  @IsString()
  email: string;
}

export class updatePharmacistDto extends PartialType(creatPharmacisDto) {}
