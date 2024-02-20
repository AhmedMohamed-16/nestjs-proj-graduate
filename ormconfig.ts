import { Admin } from 'src/admin/entities/admin.entity';
import { Permission } from 'src/admin/entities/permission';
import { Pharmacist } from 'src/pharmacy/entities/pharmacist.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Store } from 'src/store/entities/store.entity';

import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const config: MysqlConnectionOptions = {
  type: 'mysql',
  database: 'test1',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  entities: [Admin, Permission,Pharmacy, Pharmacist,Store],
  synchronize: true, //for update d
};
