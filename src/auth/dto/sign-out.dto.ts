import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignOutOutput {
  @Field()
  msg: string;
}
