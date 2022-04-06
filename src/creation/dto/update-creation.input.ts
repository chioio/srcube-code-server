import { Field, InputType } from '@nestjs/graphql';
import { Creation } from '../schema/creation';

@InputType()
export class UpdateCodeInput {
  @Field(() => String, { nullable: true })
  html: string | undefined;

  @Field(() => String, { nullable: true })
  css: string | undefined;

  @Field(() => String, { nullable: true })
  javascript: string | undefined;
}

@InputType()
export class UpdateCreationInput {
  @Field(() => String)
  _id: string;

  @Field()
  title: string = 'Untitled';

  @Field(() => String)
  author: string;

  @Field(() => UpdateCodeInput, { nullable: true })
  code: UpdateCodeInput;
}
