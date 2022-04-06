import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCodeInput {
  @Field(() => String, { nullable: true })
  html: string | undefined;

  @Field(() => String, { nullable: true })
  css: string | undefined;

  @Field(() => String, { nullable: true })
  javascript: string | undefined;
}

@InputType()
export class CreateCreationInput {
  @Field()
  title: string = 'Untitled';

  @Field(() => String)
  author: string;

  @Field(() => CreateCodeInput, { nullable: true })
  code: CreateCodeInput;
}


