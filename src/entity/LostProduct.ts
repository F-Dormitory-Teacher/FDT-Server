import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import LostStatusType from "../enum/LostStatus";
import User from "./User";

@Entity("LostProduct")
export default class LostProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "userIdx" })
  user: User;

  @Column()
  userIdx: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ nullable: false, length: 30 })
  location: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: "enum", nullable: false, enum: LostStatusType, default: LostStatusType.LOSTED })
  lostStatus: LostStatusType;

  @Column("timestamp")
  @CreateDateColumn()
  createdAt: Date;
}
