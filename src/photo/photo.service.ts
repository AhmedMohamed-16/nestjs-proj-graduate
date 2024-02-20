import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entities';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo) private readonly photoModel: Repository<Photo>,
  ) {}

  async create(createPhotoDto: any) {
    const createdPhoto = this.photoModel.create(createPhotoDto);
    return this.photoModel.save(createdPhoto);
  }

  async findAll(): Promise<Photo[]> {
    return await this.photoModel.find();
  }

  async findOne(id: string): Promise<Photo> {
    return await this.photoModel.findOne({ where: { id: +id } });
  }

  async deleteOne(id: string): Promise<any> {
    return this.photoModel.delete(+id);
  }
}
