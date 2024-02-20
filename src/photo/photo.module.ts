import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    AuthModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
