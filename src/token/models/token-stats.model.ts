import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TokenStatsModel {
    @Field(() => Number, { nullable: true })
    price?: number; 
}