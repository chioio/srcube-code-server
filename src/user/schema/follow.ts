import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Follow {
  @ObjectIdColumn()
  _id: string;

  @Field()
  @Column()
  username: string;

  @Field()
  follows: string[];
}
