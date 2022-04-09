import { CreatePinInput } from './create-pin.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePinInput extends PartialType(CreatePinInput) {
  @Field(() => Int)
  id: number;
}
