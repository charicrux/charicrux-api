import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PositionsModel {
    @Field(() => ID!)
    userId: string; 
    @Field(() => ID!)
    tokenId: string;
    @Field(() => ID!)
    _id: string;
}