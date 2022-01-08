import { Field, ObjectType } from "@nestjs/graphql";
import { TokenModel } from "./token.model";

@ObjectType()
export class AggregatedToken extends TokenModel{ 
    @Field(() => String)
    name: string; 
    @Field(() => String)
    symbol: string; 
}