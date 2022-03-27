import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Star {
  @ObjectIdColumn()
  _id: string;

  @Field()
  @Column()
  workId: string;

  @Field()
  @Column()
  users: string[];

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
