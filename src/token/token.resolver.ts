import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UserId } from "src/user/decorators/user.decorator";
import { GetAggregatedTokenDTO } from "./dto/get-aggregated-token.dto";
import { TokenStatsDTO } from "./dto/token-stats.dto";
import { AggregatedToken } from "./models/aggregated-token.model";
import { TokenBalanceModel } from "./models/token-balance.model";
import { TokenStatsModel } from "./models/token-stats.model";
import { TokenService } from "./services/token.service";
import { TokensForFixedEtherDTO } from "./dto/tokens-for-fixed-ether.dto";
import { PositionsService } from "./services/positions.service";
import { AggregatedPositionsModel } from "./models/aggregated-postions.model";

@Resolver()
export class TokenResolver {
    constructor(
        private readonly tokenService: TokenService,
        private readonly positionsService: PositionsService,
    ) {}

    @UseGuards(AuthGuard)
    @Query(() => AggregatedToken, { nullable: true })
    public async getAggregatedToken(@Args("input") input: GetAggregatedTokenDTO) {
        const response = await this.tokenService.getAggregatedToken(input); 
        return response;
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    public async purchaseTokensForFixedEther(@Args("input") input:TokensForFixedEtherDTO, @UserId() userId) {
        return await this.tokenService.buyTokensForFixedEther(userId, input);
    }

    @UseGuards(AuthGuard)
    @Query(() => TokenStatsModel)
    public async getTokenStats(@Args("input") { tokenId, ether }: TokenStatsDTO) : Promise<TokenStatsModel> {
        return this.tokenService.getTokenStats(tokenId, ether);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    public async createToken(@UserId() userId:string) {
        return await this.tokenService.create(userId);
    }

    @UseGuards(AuthGuard)
    @Query(() => TokenBalanceModel)
    public async getClientBalance(@Args("tokenId") tokenId: string, @UserId() userId) {
        return await this.tokenService.getClientTokenBalance(tokenId, userId);
    }

    @UseGuards(AuthGuard)
    @Query(() => [ AggregatedPositionsModel ])
    public async getTokenPositions(@Args("userId") userId:string) : Promise<AggregatedPositionsModel[]> {
        return await this.positionsService.getAggregatedPositions(userId);
    }
}