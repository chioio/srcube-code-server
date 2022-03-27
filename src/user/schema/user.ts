import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ROOT,
  ADMIN,
  USER,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity()
@Unique(['username'])
export class User {
  @ObjectIdColumn()
  _id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  password: string;

  @Field({ nullable: true })
  @Column()
  nickname: string = null;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  avatar: string;

  @Field(() => [UserRole])
  @Column()
  roles: [UserRole] = [UserRole.USER];

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
