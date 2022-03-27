import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
export class SignUpOutput {
  @Field()
  user: string;
}
