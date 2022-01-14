import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TokenBalanceModel {
    @Field(() => Number)
    balance: number; 
}