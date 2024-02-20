import { Injectable } from '@nestjs/common';
import { Store } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { creatStoreDto, updateStoreDto } from './dto/creat-storeDto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}
  async findAll() {
    return await this.storeRepository.find();
  }
  async find(id: number) {
    return await this.storeRepository.findOne({
      where: { id: id },
    });
  }

  async findByLicense(license: number) {
    return await this.storeRepository.findOne({
      where: { license: license },
    });
  }

  async create(creatStoreDto: creatStoreDto) {
    const u = await this.findByLicense(creatStoreDto.license);
    if (u) {
      return 'already exist';
    }

    const user = await this.storeRepository.create({
      ...creatStoreDto,
    });
    await this.storeRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateStoreDto: updateStoreDto) {
    const u = await this.find(id);
    if (!u) {
      return 'admin not  exist';
    }

    return await this.storeRepository.preload({ id, ...updateStoreDto });
  }
  async delete(id: number) {
    const u = await this.find(id);
    if (!u) {
      return 'admin not  exist';
    }

    return await this.storeRepository.delete(id);
  }

  async validateStore(license: number, password: string) {
    const user = await this.findByLicense(license);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async savingStore(store: Store) {
    const { id, ...res } = store;
    return await this.storeRepository.update(id, res);
  }
}
