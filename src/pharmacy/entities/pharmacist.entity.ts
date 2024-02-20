import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Pharmacy } from './pharmacy.entity';

@Entity()
export class Pharmacist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fname: string;
  @Column({ nullable: false })
  lname: string;

  @Column({ nullable: false, unique: true, default: 'emaill' })
  email: string;

  @Column({ nullable: false, unique: true, length: 11 })
  phone: string;

  @OneToMany((type) => Pharmacy, (Pharmacy) => Pharmacy.pharmacist)
  pharmacy: Pharmacy[];
}
