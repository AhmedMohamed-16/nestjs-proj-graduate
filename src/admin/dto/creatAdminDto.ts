import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNumberString, IsString } from 'class-validator';

export class creatAdminDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;

  @IsNumberString()
  phone: string;

  @IsString({ each: true })
  permission: string[];
}

export class updateAdminDto extends PartialType(creatAdminDto) {}
