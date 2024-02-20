import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';
import { Pharmacy } from './entities/pharmacy.entity';
import { Pharmacist } from './entities/pharmacist.entity';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AbilitiFactory } from 'src/apility/abiliti-factory/abiliti-factory';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { Permission } from 'src/admin/entities/permission';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Permission, Pharmacy, Pharmacist]),
  ],
  providers: [PharmacyService, AbilitiFactory, AdminService],
  controllers: [PharmacyController],
  exports: [PharmacyService],
})
export class PharmacyModule {}
