import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import ArticleStatus from "../enum/ArticleStatus";
import User from "./User";

@Entity("Attendance")
export default class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userIdx" })
  user: User;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column("enum", { enum: ArticleStatus })
  status: ArticleStatus;

  @Column("timestamp")
  @CreateDateColumn()
  createdAt: Date;

  @Column("timestamp")
  @UpdateDateColumn()
  updatedAt: Date;
}
