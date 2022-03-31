import { CreateCreationInput } from './create-creation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCreationInput extends PartialType(CreateCreationInput) {
  @Field(() => Int)
  id: number;
}