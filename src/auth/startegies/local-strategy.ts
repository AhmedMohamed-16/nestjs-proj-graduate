import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { PharmacyService } from 'src/pharmacy/pharmacy.service';
import { StoreService } from 'src/store/store.service';
@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'local-admin',
) {
  constructor(private readonly AdminService: AdminService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    }); //error solution
  }
  async validate(email: string, password: string) {
    const user = await this.AdminService.validateAdmin(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
@Injectable()
export class StoreLocalStrategy extends PassportStrategy(
  Strategy,
  'local-store',
) {
  constructor(private StoreService: StoreService) {
    //
    super({
      usernameField: 'license',
      passwordField: 'password',
    }); //error solution
  }
  async validate(license: string, password: string) {
    const user = await this.StoreService.validateStore(+license, password);
    if (!user) {
      throw new UnauthorizedException('strore not found');
    }

    return user;
  }
}
@Injectable()
export class PharmarcyLocalStrategy extends PassportStrategy(
  Strategy,
  'local-pharmacy',
) {
  constructor(
    private PharmacyService: PharmacyService, //
  ) {
    super({
      usernameField: 'license',
      passwordField: 'password',
    }); //error solution
  }
  async validate(license: string, password: string) {
    const user = await this.PharmacyService.validatePharmacy(
      +license,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
