import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePinInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
