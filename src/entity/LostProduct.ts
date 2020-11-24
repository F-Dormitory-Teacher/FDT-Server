import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import LostStatusType from "../enum/LostStatus";
import User from "./User";

@Entity("LostProduct")
export default class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne((type) => User, (user) => user.lostProduct)
  user: User;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ nullable: false, length: 30 })
  location: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: "enum", nullable: false, enum: LostStatusType })
  @Column("timestamp")
  @CreateDateColumn()
  createdAt: Date;
}
