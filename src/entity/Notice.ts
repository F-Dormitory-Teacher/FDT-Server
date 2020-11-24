import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import AttendType from "../enum/AttendType";

@Entity("Notice")
export default class Notice extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ length: 100, nullable: false })
  title: string;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ nullable: false })
  type: AttendType;

  @Column({ type: "date", nullable: false })
  date: Date;

  @Column("timestamp")
  @CreateDateColumn()
  createdAt: Date;
}
