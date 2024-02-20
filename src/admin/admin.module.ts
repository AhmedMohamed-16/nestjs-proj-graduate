import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';

import { Permission } from './entities/permission';
import twilioConfig from './config/twilio.config';
import { ConfigModule } from '@nestjs/config';
import { AbilityModule } from 'src/apility/ability.module';
import { AbilitiFactory } from 'src/apility/abiliti-factory/abiliti-factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Permission]),
    ConfigModule.forRoot({
      load: [twilioConfig],
    }),
  ],
  providers: [AdminService, AbilitiFactory],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
