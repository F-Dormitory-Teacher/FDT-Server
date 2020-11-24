import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import AttendType from "../enum/AttendType";
import User from "./User";
import AttendStatus from "../enum/AttendStatus";

@Entity("Attendance")
export default class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  // user
  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userIdx" })
  user: User;

  @Column()
  userIdx: number;

  // 아침 / 저녁
  @Column("enum", { enum: AttendType })
  type: AttendType;

  // 출석 여부
  @Column("enum", {
    nullable: false,
    enum: AttendStatus
  })
  status: AttendStatus;

  // 날짜
  @Column({ type: "date", nullable: false })
  date: Date;
}
