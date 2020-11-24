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

@Entity("Article")
export default class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userIdx" })
  user: User;

  @Column()
  userIdx: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column("enum", { enum: ArticleStatus, default: ArticleStatus.NONE })
  status: ArticleStatus;

  @Column("timestamp")
  @CreateDateColumn()
  createdAt: Date;

  @Column("timestamp")
  @UpdateDateColumn()
  updatedAt: Date;
}
