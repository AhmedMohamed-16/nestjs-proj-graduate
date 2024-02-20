import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import {
  AdminLocalStrategy,
  PharmarcyLocalStrategy,
  StoreLocalStrategy,
} from './startegies/local-strategy';

import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './startegies/jwt-strategy';
import { RefreshJwtStrategy } from './startegies/refresh-jwt-strategy';

import { ConfigService } from '@nestjs/config';
import { AdminModule } from 'src/admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { AdminService } from 'src/admin/admin.service';
import { AbilityModule } from 'src/apility/ability.module';
import { PharmacyModule } from 'src/pharmacy/pharmacy.module';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Store } from 'src/store/entities/store.entity';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '60m' },
    }),
    PassportModule,
    AdminModule,
    AbilityModule,
    PharmacyModule,
    StoreModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    AdminLocalStrategy,
    StoreLocalStrategy,
    PharmarcyLocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
