import { InputType, Int, Field } from '@nestjs/graphql';
import { PartialType } from '@nestjs/graphql';

@InputType()
export class CreateWorkInput {
  @Field()
  name: string = 'Untitled';

  @Field()
  username: string;

  @Field()
  codeHTML: string;

  @Field()
  codeCSS: string;

  @Field()
  codeJS: string;
}

@InputType()
export class UpdateWorkInput extends PartialType(CreateWorkInput) {
  @Field(() => Int)
  id: number;
}
