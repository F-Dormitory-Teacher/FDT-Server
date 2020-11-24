import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import AttendType from "../enum/AttendType";
import User from "./User";

@Entity("Attendance")
export default class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userIdx" })
  user: User;

  @Column("enum", { enum: AttendType })
  type: AttendType;

  @Column({
    nullable: false,
    default: false
  })
  isAttendance: boolean;

  @Column({ type: "date", nullable: false })
  date: Date;
}
