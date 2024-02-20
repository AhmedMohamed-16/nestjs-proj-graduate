import {
  Ability,
  MongoAbility,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Store } from 'src/store/entities/store.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  accessOredrStatus = 'accessOredrStatus',
  accessPharmacyStatus = 'accessPharmacyStatus',
  accessStatistics = 'accessStatistics',
  accessStoreStatus = 'accessStoreStatus',
}
export type Subjects =
  | InferSubjects<typeof Admin | typeof Pharmacy | typeof Store>
  | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilitiFactory {
  constructor(private AdminService: AdminService) {}
  async defineAbility(user: any) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    console.log('user.sub.type', user.sub.type);

    switch (user.sub.type) {
      case 'admin': {
        //console.log(user.email + 'AbilitiFactory');
        const use = await this.AdminService.findByemail(user.email);
        //console.log(user.email + 'before AbilitiFactory');
        if (use.isManager) {
          can(Action.Manage, 'all');
          // console.log(user.email + 'after  Manage AbilitiFactory');
        } else {
          // console.log(user.email + ' after AbilitiFactory');
          use.permission.map((permiss) => {
            //  console.log(Action[permiss.name] + ' in AbilitiFactory');
            can(Action[permiss.name], Admin);
            can(Action[permiss.name], Store); //modify
            can(Action[permiss.name], Pharmacy); //modify
          });
        }

        break;
      }

      case 'store':
        can(Action.Manage, Store); // modify Action.Read
        break;
      case 'pharmacy':
        {
          can(Action.Read, Pharmacy); //can(Action.Read, Pharmacy);
          console.log('can(Action.Read, Pharmacy);');
        }
        break;
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
