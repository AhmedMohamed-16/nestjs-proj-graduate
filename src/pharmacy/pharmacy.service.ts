import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Pharmacy } from './entities/pharmacy.entity';
import { Pharmacist } from './entities/pharmacist.entity';
import { creatPharmacyDto, updatePharmacyDto } from './dto/creatPharmacyDto';
import {
  creatPharmacisDto,
  updatePharmacistDto,
} from './dto/createPharmacistDto';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,

    @InjectRepository(Pharmacist)
    private readonly pharmacistRepository: Repository<Pharmacist>,
  ) {}

  //admin conrtolling
  async findAll() {
    return await this.pharmacyRepository.find({
      relations: ['pharmacist'],
    });
  }
  async findById(id: number) {
    return await this.pharmacyRepository.findOne({
      where: { id: id },
      relations: { pharmacist: true },
    });
  }
  //make sure the user is logged in

  async findByLicense(license: number) {
    return await this.pharmacyRepository.findOne({
      where: { license: license },
      relations: ['pharmacist'],
    });
  }

  async create(creatPharmacyDto: creatPharmacyDto) {
    const u = await this.findByLicense(creatPharmacyDto.license);
    if (u) {
      return 'already exist';
    }

    const {
      pharmacistEmail,
      pharmacistFName,
      pharmacistLName,
      pharmacistPhone,
      ...result
    } = creatPharmacyDto;

    const pharmacist = await this.creatPharmacis({
      email: pharmacistEmail,
      fname: pharmacistFName,
      lname: pharmacistLName,
      phone: pharmacistPhone,
    });
    const pharmacy = await this.pharmacyRepository.create({
      ...result,
      pharmacist,
    });

    await this.pharmacyRepository.save(pharmacy);

    const { password, ...resul } = pharmacy;
    return resul;
  }

  async update(id: number, updatePharmacyDto: updatePharmacyDto) {
    const u = await this.findById(id);
    if (!u) {
      return 'Pharmacy not  exist';
    }

    const {
      pharmacistEmail,
      pharmacistFName,
      pharmacistLName,
      pharmacistPhone,
      ...result
    } = updatePharmacyDto;

    const pharmacist = await this.updatePharmacis({
      email: pharmacistEmail,
      fname: pharmacistFName,
      lname: pharmacistLName,
      phone: pharmacistPhone,
    });

    const updatePharmacyDt = { pharmacist, ...result };
    console.log(updatePharmacyDt);
    return await this.pharmacyRepository.update(id, updatePharmacyDt);
  }
  async delete(id: number) {
    const u = await this.findById(id);
    if (!u) {
      return 'admin not  exist';
    }

    return await this.pharmacyRepository.delete(id);
  }

  async validatePharmacy(license: number, password: string) {
    const Pharmacy = await this.findByLicense(license);

    if (Pharmacy && (await bcrypt.compare(password, Pharmacy.password))) {
      const { password, ...result } = Pharmacy;

      return result;
    }

    return null;
  }

  //pharmacist  conrtolling

  async findByPharmacistEmail(email: string) {
    const pharmacist = await this.pharmacistRepository.findOne({
      where: { email: email },
      relations: { pharmacy: true },
    });
    return pharmacist;
  }
  async creatPharmacis(creatDto: creatPharmacisDto) {
    const u = await this.findByPharmacistEmail(creatDto.email);
    if (u) {
      return u;
    }
    const pharmacist = await this.pharmacistRepository.create({ ...creatDto });
    await this.pharmacistRepository.save(pharmacist);

    return pharmacist;
  }
  async updatePharmacis(updateDto: updatePharmacistDto) {
    const u = await this.findByPharmacistEmail(updateDto.email);
    const id = u.id;
    const pharmacist = await this.pharmacistRepository.preload({
      id,
      ...updateDto,
    });
    console.log(pharmacist);
    return pharmacist;
  }

  async deletePharmacis(deleteDto: creatPharmacisDto) {
    const pharmacist = await this.findByPharmacistEmail(deleteDto.email);
    const pharmacy = await Promise.all(
      pharmacist.pharmacy.map((license) => this.findByLicense(license.license)),
    );
    if (!pharmacy) {
      await this.pharmacistRepository.delete(pharmacist.id);
    }
  }
  async findByToken(token: string) {
    return await this.pharmacyRepository.findOne({
      where: { code: token },
    });
  }
  async savingPharmacy(pharmacy: Pharmacy) {
    const { id, ...res } = pharmacy;
    return await this.pharmacyRepository.update(id, res);
  }
}
