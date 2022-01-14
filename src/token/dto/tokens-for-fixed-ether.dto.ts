import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class TokensForFixedEtherDTO {
    @Field(() => Number)
    ether: number; 
    @Field(() => ID)
    tokenId: string
}