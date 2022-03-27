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
export class Category {
  @ObjectIdColumn()
  _id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => [String])
  @Column()
  workIds: [string];

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
