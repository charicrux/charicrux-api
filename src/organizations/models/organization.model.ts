import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Organization {
  @Field(() => ID!)
  _id: string;

  @Field(() => String)
  symbol: string;

  @Field(() => String)
  name: string;
}