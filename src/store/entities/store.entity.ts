import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  license: number;

  @Column({ nullable: false, default: false })
  activeAccount: Boolean;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unique: true, length: 11 })
  phone: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: false })
  country: string;
  @Column({ nullable: false })
  government: string;
  @Column({ nullable: false })
  regeion: string;
  @Column({ nullable: false, unique: true })
  address: string;

  @Column({ nullable: true })
  companyName: string;
  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false, default: 'file' })
  commercialRegistration: string; //

  @Column({ nullable: true })
  email: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
