import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FollowDocument = Follow & Document;

@ObjectType()
@Schema({
  timestamps: true,
})
export class Follow {
  @Field()
  _id: string;

  @Field()
  @Prop(String)
  username: string;

  // following field
  @Field()
  @Prop(String)
  following: string;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
