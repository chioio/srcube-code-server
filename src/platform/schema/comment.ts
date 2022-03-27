import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Comment {
  @ObjectIdColumn()
  _id: string;

  @Field()
  @Column()
  workId: string;

  @Field()
  @Column()
  user: {
    nickname: string;
    username: string;
  };

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
