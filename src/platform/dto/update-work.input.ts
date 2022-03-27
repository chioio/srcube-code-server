import { CreateWorkInput } from './work.dto';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWorkInput extends PartialType(CreateWorkInput) {
  @Field(() => Int)
  id: number;
}
