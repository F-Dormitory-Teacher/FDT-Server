import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import LostStatusType from "../enum/LostStatus";

@Entity("LostProduct")
export default class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

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
