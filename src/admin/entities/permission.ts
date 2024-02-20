import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
 
import { Admin } from './admin.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false, unique: true })
  name: string;

  @ManyToMany((type) => Admin, (Admin) => Admin.permission)
  admin: Admin[];
}
