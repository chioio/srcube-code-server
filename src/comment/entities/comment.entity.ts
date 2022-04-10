import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CreationDocument = Comment & Document;

@ObjectType()
export class Commenter {
  @Field()
  @Prop(String)
  title: string;

  @Field()
  @Prop(String)
  username: string;

  @Field()
  @Prop(String)
  avatar: string;
}

@ObjectType()
@Schema({
  timestamps: true,
})
export class Comment {
  @Field()
  _id: string;

  @Field()
  @Prop(String)
  creationId: string;

  @Field(() => Commenter)
  @Prop(Commenter)
  commenter: Commenter;

  @Field()
  @Prop(String)
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
