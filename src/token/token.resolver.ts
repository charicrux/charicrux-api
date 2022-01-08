import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UserId } from "src/user/decorators/user.decorator";
import { GetAggregatedTokenDTO } from "./dto/get-aggregated-token.dto";
import { AggregatedToken } from "./models/aggregated-token.model";
import { TokenService } from "./services/token.service";

@Resolver()
export class TokenResolver {
    constructor(
        private readonly tokenService: TokenService
    ) {}

    @Query(() => AggregatedToken)
    public async getAggregatedToken(@Args("input") input: GetAggregatedTokenDTO) {
        return await this.tokenService.getAggregatedToken(input); 
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    public async createToken(@UserId() userId:string) {
        return await this.tokenService.create(userId);
    }
}