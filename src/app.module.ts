import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../ormconfig';
import { AuthModule } from './auth/auth.module';
import { AbilityModule } from './apility/ability.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { StoreModule } from './store/store.module';
import { PhotoModule } from './photo/photo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    AuthModule,
    AbilityModule,
    PharmacyModule,
    StoreModule,
    PhotoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
