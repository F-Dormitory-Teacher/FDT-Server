import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";

@Entity("EmailAuthentication")
export default class EmailAuthentication extends BaseEntity {
  @PrimaryColumn()
  authCode: string;

  @Column({
    length: 100,
    nullable: false
  })
  email: string;

  @Column({ nullable: false, default: false })
  isCertified: boolean;

  @Column({ nullable: false, type: "timestamp" })
  expireAt: Date;
}
