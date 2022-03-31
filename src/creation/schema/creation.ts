import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CreationDocument = Creation & Document;

@ObjectType()
@Schema()
export class CreationCode {
  @Field()
  @Prop(String)
  html: string;

  @Field()
  @Prop(String)
  css: string;

  @Field()
  @Prop(String)
  javascript: string;
}

@ObjectType()
@Schema({
  timestamps: true,
})
export class Creation {
  @Field()
  _id: string;

  @Field()
  @Prop(String)
  title: string;

  @Field()
  @Prop(String)
  author: string;

  @Field()
  @Prop(CreationCode)
  code: CreationCode;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const CreationSchema = SchemaFactory.createForClass(Creation);
