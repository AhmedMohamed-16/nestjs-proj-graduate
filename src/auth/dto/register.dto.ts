import {
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class registerDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsNumberString()
  phone: string;

  @IsString()
  userType: 'admin' | 'store' | 'pharmacy';

  @IsOptional()
  @IsString({ each: true })
  permission?: string[];

  @IsOptional()
  @IsNumber()
  license?: number;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  government?: string;
  @IsOptional()
  @IsString()
  regeion?: string;
  @IsOptional()
  @IsString()
  address?: string;
  @IsOptional()
  @IsString()
  pharmacistFName?: string;
  @IsOptional()
  @IsString()
  pharmacistLName?: string;
  @IsOptional()
  @IsString()
  pharmacistPhone?: string;
  @IsOptional()
  @IsString()
  pharmacistEmail?: string;
  @IsOptional()
  @IsString()
  companyName?: string;
  @IsOptional()
  image?: string;
  @IsOptional()
  commercialRegistration?: string;
  //how to make optional
  // @IsOptional()
}
