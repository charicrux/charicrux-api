import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TokenModel {
    @Field(() => ID!)
    _id: string; 
    @Field(() => ID!) 
    organizationId: string; 
    @Field(() => String!)
    address?: string; 
}