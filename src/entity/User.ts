import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from "typeorm";
import Attendance from "./Attendance";
import LostProduct from "./LostProduct";

@Entity("User")
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({
    length: 100,
    nullable: false
  })
  email: string;

  @Column({
    length: 50,
    nullable: false
  })
  name: string;

  @Column({
    length: 4,
    nullable: false
  })
  studentId: string;

  @Column({
    length: 256,
    nullable: false
  })
  pw: string;

  @Column({
    default: false,
    nullable: false
  })
  isAdmin: boolean;

  @Column("timestamp")
  @CreateDateColumn()
  createdAt: Date;
}
