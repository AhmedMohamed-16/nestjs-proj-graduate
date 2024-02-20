import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { creatAdminDto, updateAdminDto } from './dto/creatAdminDto';
import { AdminService } from './admin.service';
import { JwtAuthGaurd } from 'src/auth/guards/jwt-authguard';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { CheckAbility } from 'src/auth/decorators/authorize.decorator';
import { Action } from 'src/apility/abiliti-factory/abiliti-factory';
import { Admin } from './entities/admin.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //Operation Admin controlling   //must be aware with  @Get(':id')   =>:id

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.accessOredrStatus, subject: Admin })
  @Get('accessOredrStatus')
  accessOredrStatus() {
    return 'accessOredrStatus';
  }
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.accessPharmacyStatus, subject: Admin })
  @Get('accessPharmacyStatus')
  accessPharmacyStatus() {
    return 'accessPharmacyStatus';
  }
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.accessStatistics, subject: Admin })
  @Get('accessStatistics')
  accessStatistics() {
    return 'accessStatistics';
  }
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.accessStoreStatus, subject: Admin })
  @Get('accessStoreStatus')
  accessStoreStatus() {
    return 'accessStoreStatus';
  }

  //Permission controlling

  @Get('getPermission')
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Manage, subject: Admin })
  async getPermission(): Promise<any> {
    return 'ssss';
  }

  //CRUD Admin controlling

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: Admin })
  @Get('')
  async getAll(): Promise<any> {
    return await this.adminService.findAll();
  }

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: Admin })
  @Get(':id')
  async findByIdAdmin(@Param('id') id: number): Promise<any> {
    return await this.adminService.find(id);
  }

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: Admin })
  @Post('get')
  async findByEmailAndPass(@Body() updateAdminDto: updateAdminDto) {
    return await this.adminService.validateAdmin(
      updateAdminDto.email,
      updateAdminDto.password,
    );
  }
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: Admin })
  @Post('create')
  createAdmin(@Body() creatUserDto: creatAdminDto): any {
    return this.adminService.create(creatUserDto);
  }
 
  
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Update, subject: Admin })
  @Put(':id')
  updateAdmin(@Param('id') id: number, @Body() updateUserDt: updateAdminDto) {
    return this.adminService.update(id, updateUserDt);
  }

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Delete, subject: Admin })
  @Delete(':id')
  deleteAdmin(@Param('id') id: number) {
    return this.adminService.delete(id);
  }

  //
  // @Put(':id')
  // updatePermission(
  //   @Param('id') id: number,
  //   @Body() updatePermissionDto: updatePermissionDto,
  // ) {
  //   return this.adminService.updatePermission(id, updatePermissionDto);
  // }
  // @Delete(':id')
  // deletePermission(@Param('id') id: number) {
  //   return this.adminService.deletePermssion(id);
  // }
  // @Post('permissions')
  // createPermission(@Body() creatPermissionDto: creatPermissionDto): any {
  //   return this.adminService.creatPermission(creatPermissionDto);
  // }
}

// }
