import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "./user.model";
import { Organization } from "../../organizations/models/organization.model";

@ObjectType()
class Wallet {
    @Field(() => ID!)
    _id: string;
    @Field(() => String!)
    address: string; 
}

@ObjectType()
export class AggregatedUser extends User {
    @Field({ nullable: true })
    accessToken?: string
    @Field({ nullable: true, defaultValue: null })
    organization?: Organization
    @Field()
    wallet: Wallet
}   