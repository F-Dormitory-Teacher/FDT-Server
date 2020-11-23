import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

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

  @Column("timestampz")
  @CreateDateColumn()
  createdAt: Date;
}
