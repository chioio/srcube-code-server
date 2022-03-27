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
export class Work {
  @ObjectIdColumn()
  _id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  user: string;

  @Field()
  @Column()
  codeHTML: string;

  @Field()
  @Column()
  codeCSS: string;

  @Field()
  @Column()
  codeJS: string;

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
