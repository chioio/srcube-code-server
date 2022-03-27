import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  avatar: string;
}
