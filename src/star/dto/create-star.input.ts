import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStarInput {
  @Field()
  username: string;

  @Field()
  creationId: string;
}
