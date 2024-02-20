import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNumberString, IsString } from 'class-validator';

export class creatPermissionDto {
  @IsString()
  name: string;
}

export class updatePermissionDto extends PartialType(creatPermissionDto) {}
