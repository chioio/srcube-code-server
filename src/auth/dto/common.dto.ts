import {
  InputType,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum AccountType {
  USERNAME,
  EMAIL,
}

registerEnumType(AccountType, {
  name: 'AccountType',
});

@InputType()
export class ExistedCheckInput {
  @Field(() => AccountType)
  type: AccountType;

  @Field()
  value: string;
}

@ObjectType()
export class ExistedCheckOutput {
  @Field()
  result: boolean;
}
