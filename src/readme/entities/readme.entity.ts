import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ReadmeDocument = Readme & Document;

@ObjectType()
@Schema({
  timestamps: true,
})
export class Readme {
  @Field()
  _id: string;

  @Field()
  @Prop(String)
  user: string;

  @Field()
  @Prop(String)
  content: string;
}

export const ReadmeSchema = SchemaFactory.createForClass(Readme);
