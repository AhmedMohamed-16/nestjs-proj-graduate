import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Pharmacist } from './pharmacist.entity';

@Entity()
export class Pharmacy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Index({ unique: true })
  @Column({ nullable: false, unique: true })
  license: number;

  @Column({ nullable: false, default: false })
  activeAccount: Boolean;

  @Column({ nullable: false, default: 'region' })
  password: string;

  @Index({ unique: true })
  @Column({ nullable: false, unique: true, length: 11, default: 'region' })
  phone: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: false, default: 'region' })
  country: string;

  @Column({ nullable: false, default: 'region' })
  government: string;
  @Column({ nullable: false, default: 'region' })
  regeion: string;
  @Index({ unique: true })
  @Column({ nullable: false, unique: true, default: 'default address' })
  address: string;
  @JoinTable()
  @ManyToOne((type) => Pharmacist, (Pharmacist) => Pharmacist.pharmacy, {
    cascade: true,
  })
  pharmacist: Pharmacist; // remove table roles
  @Column({ nullable: false, default: 'image' })
  image: string; //

  @Column({ nullable: false, default: 'file' })
  commercialRegistration: string; //

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
