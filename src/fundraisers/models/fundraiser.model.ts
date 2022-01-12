import { Field, ObjectType } from "@nestjs/graphql";
import { EFundraiserStatus } from "../enums/fundraiser-status.enum";

@ObjectType()
export class FundraiserModel {
    @Field(() => String)
    _id: string; 
    @Field(() => String)
    name: string; 
    @Field(() => String)
    purpose: string;
    @Field(() => Number) 
    goal:number
    @Field(() => String)
    userId: string; 
    @Field(() => String)
    organizationId: string; 
    @Field(() => String,{ nullable: true })
    status?: EFundraiserStatus
}