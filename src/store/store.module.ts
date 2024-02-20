import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './entities/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilitiFactory } from 'src/apility/abiliti-factory/abiliti-factory';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { Permission } from 'src/admin/entities/permission';

@Module({
  imports: [TypeOrmModule.forFeature([Store,Admin,Permission])],
  providers: [StoreService,AbilitiFactory,AdminService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
