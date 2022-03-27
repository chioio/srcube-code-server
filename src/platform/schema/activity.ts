import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ActivityType {
  USER,
  SOCIAL,
  SYSTEM,
}

registerEnumType(ActivityType, {
  name: 'ActivityType',
});

@ObjectType()
@Entity()
export class Activity {
  @ObjectIdColumn()
  _id: string;

  @Field()
  @Column()
  user: {
    nickname: string;
    username: string;
  };

  @Field(() => ActivityType)
  @Column()
  type: [ActivityType];

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
