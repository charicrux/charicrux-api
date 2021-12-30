import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./user.model";

@ObjectType()
export class AggregatedUser extends User {
    @Field({ nullable: true })
    accessToken?: string
}   