import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  creationId: string;

  @Field(() => String)
  commenter: string;

  @Field(() => String)
  content: string;
}
