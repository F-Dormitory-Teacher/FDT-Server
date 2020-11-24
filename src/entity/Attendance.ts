import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

@Entity("Attendance")
export default class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne((type) => User, (user) => user.attendances, { eager: true })
  @JoinColumn({ referencedColumnName: "idx" })
  user: User;

  @Column({
    nullable: false,
    default: false
  })
  isAttendMorning: boolean;

  @Column({
    nullable: false,
    default: false
  })
  isAttendDinner: boolean;

  @Column({ default: 1, nullable: false })
  attendanceId: number;

  @Column({ type: "timestamp", nullable: true })
  attendMorningAt: Date;

  @Column({ type: "timestamp", nullable: true })
  attendDinnerAt: Date;
}
