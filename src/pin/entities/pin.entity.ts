import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PinDocument = Pin & Document;

@ObjectType()
@Schema({
  timestamps: true,
})
export class Pin {
  @Field()
  _id: string;

  // username
  @Field()
  @Prop({ type: String, required: true, unique: true })
  username: string;

  // creation ids
  @Field(() => [String])
  @Prop([String])
  creationIds: string[] = [];

  // createdAt
  @Field()
  createdAt: Date;

  // updatedAt
  @Field()
  updatedAt: Date;
}

export const PinSchema = SchemaFactory.createForClass(Pin);
