import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { Repository } from 'typeorm';
import { creatAdminDto, updateAdminDto } from './dto/creatAdminDto';
import * as bcrypt from 'bcrypt';

import { Permission } from './entities/permission';
import {
  creatPermissionDto,
  updatePermissionDto,
} from './dto/creatPermissionDto copy';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  //admin conrtolling
  async findAll() {
    return await this.adminRepository.find({
      relations: ['permission'],
    });
  }
  async find(id: number) {
    return await this.adminRepository.findOne({
      where: { id: id },
      relations: ['permission'],
    });
  }

  async findByemail(email: string) {
    return await this.adminRepository.findOne({
      where: { email: email },
      relations: ['permission'],
    });
  }

  async create(ctraetUserDto: creatAdminDto) {
    const u = await this.adminRepository.findOne({
      where: { email: ctraetUserDto.email },
    });
    if (u) {
      return 'already exist';
    }
    const permission = await Promise.all(
      ctraetUserDto.permission.map((name) => this.findByNamePermission(name)),
    );

    const user = await this.adminRepository.create({
      ...ctraetUserDto,
      permission,
    });
    await this.adminRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: updateAdminDto) {
    const u = await this.find(id);
    if (!u) {
      return 'admin not  exist';
    }

    const permissions = await Promise.all(
      updateUserDto.permission.map((name) => this.findByNamePermission(name)),
    );
    const { permission, ...result } = updateUserDto;
    const updateUserDt = { ...result, permissions };

    return await this.adminRepository.update(id, updateUserDt);
  }
  async delete(id: number) {
    const u = await this.find(id);
    if (!u) {
      return 'admin not  exist';
    }

    return await this.adminRepository.delete(id);
  }

  async validateAdmin(email: string, password: string) {
    const user = await this.findByemail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  //permission conrtolling
  async getPermissions() {
    return await this.permissionRepository.find();
  }
  async findByNamePermission(name: string) {
    return await this.permissionRepository.findOne({
      where: { name: name },
    });
  }
  async creatPermission(creatPermissionDto: creatPermissionDto) {
    const u = await this.permissionRepository.findOne({
      where: { name: creatPermissionDto.name },
    });
    if (u) {
      return 'already exist';
    }
    const permission =
      await this.permissionRepository.create(creatPermissionDto);
    await this.permissionRepository.save(permission);

    return permission;
  }

  async updatePermission(id: number, updatePermissionDto: updatePermissionDto) {
    const u = await this.permissionRepository.findOne({
      where: { name: creatPermissionDto.name },
    });
    if (!u) {
      return 'role not  exist';
    }

    return await this.permissionRepository.preload({
      id,
      ...updatePermissionDto,
    });
  }

  async deletePermssion(id: number) {
    const u = await this.permissionRepository.findOne({
      where: { name: creatPermissionDto.name },
    });
    if (!u) {
      return 'permission not  exist';
    }

    return await this.permissionRepository.delete(id);
  }

  async savingAdmin(admin: Admin) {
    const { id, ...res } = admin;
    return await this.adminRepository.update(id, res);
  }
}
