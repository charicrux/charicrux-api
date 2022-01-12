import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UserId } from "src/user/decorators/user.decorator";
import { CreateFundraiserDTO } from "./dtos/create-fundraiser.dto";
import { FundraiserService } from "./fundraiser.service";
import { AggregatedFundraiserModel } from "./models/aggregated-fundraiser.model";
import { FundraiserModel } from "./models/fundraiser.model";

@Resolver(() => FundraiserModel) 
export class FundraiserResolver {
    constructor(
        private readonly fundraiserService: FundraiserService
    ) {}

    @UseGuards(AuthGuard)
    @Mutation(() => FundraiserModel) 
    public async createFundraiser(@Args("input") input:CreateFundraiserDTO, @UserId() userId) : Promise<FundraiserModel> {
        return await this.fundraiserService.create(input, userId);
    }

    @UseGuards(AuthGuard)
    @Query(() => [ AggregatedFundraiserModel ])
    public async getFundraiserByQuery(@Args("query") query:string) : Promise<AggregatedFundraiserModel[]> {
        return await this.fundraiserService.getFundraisersByQuery(query);
    }
}