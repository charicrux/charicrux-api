import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class TokenStatsDTO {
    @Field(() => ID!)
    tokenId: string; 
    @Field(() => Number)
    ether: number; 
}