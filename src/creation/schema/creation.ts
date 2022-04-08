import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CreationDocument = Creation & Document;

@ObjectType()
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

  @Field(() => CreationCode)
  @Prop(CreationCode)
  code: CreationCode;

  @Field()
  @Prop(Number)
  stars: number = 0;

  @Field()
  @Prop(Number)
  comments: number = 0;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const CreationSchema = SchemaFactory.createForClass(Creation);
