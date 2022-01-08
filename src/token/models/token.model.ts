import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TokenModel {
    @Field(() => ID!) 
    organizationId: string; 
}