import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity("EmailAuthentication")
export default class EmailAuthentication extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({
    length: 100,
    nullable: false
  })
  email: string;

  @Column({ nullable: false, default: false })
  isCertified: boolean;

  @Column({ nullable: false })
  authCode: string;

  @Column({ nullable: false, type: "timestamp" })
  expireAt: Date;
}
