import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  ROOT,
  ADMIN,
  USER,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

export type UserDocument = User & Document;
@ObjectType()
@Schema({
  timestamps: true,
})
export class User {
  @Field(() => String)
  _id: string;

  @Field()
  @Prop(String)
  email: string;

  @Field()
  @Prop(String)
  username: string;

  @Field()
  @Prop(String)
  password: string;

  @Field()
  @Prop(String)
  firstName: string;

  @Field()
  @Prop(String)
  lastName: string;

  @Field()
  @Prop(String)
  avatar: string;

  @Field(() => [UserRole])
  @Prop(UserRole)
  roles: [UserRole] = [UserRole.USER];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
