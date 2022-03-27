import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../../user/schema/user';

@InputType()
export class SignInInput {
  @Field()
  account: string;

  @Field()
  password: string;

  @Field()
  type: 'username' | 'email';
}

@ObjectType()
export class UserProfileOutput {
  @Field()
  username: string;

  @Field(() => String, { nullable: true })
  nickname: string;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String)
  avatar: string;

  @Field(() => [UserRole])
  roles: [UserRole];
}

@ObjectType()
export class SignInOutput {
  @Field()
  token: string;

  @Field()
  profile: UserProfileOutput;
}