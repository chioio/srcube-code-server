import { InputType, Int, Field } from '@nestjs/graphql';
import { PartialType } from '@nestjs/graphql';

@InputType()
export class CreationCodeInput {
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

  @Field(() => CreationCodeInput, { nullable: true })
  code: CreationCodeInput;
}


