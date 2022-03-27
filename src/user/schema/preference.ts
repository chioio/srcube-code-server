import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Preference {
  @ObjectIdColumn()
  _id: string;

  @Field()
  @Column()
  settings: object;
}
