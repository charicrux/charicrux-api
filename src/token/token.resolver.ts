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

    @UseGuards(AuthGuard)
    @Query(() => AggregatedToken, { nullable: true })
    public async getAggregatedToken(@Args("input") input: GetAggregatedTokenDTO) {
        return await this.tokenService.getAggregatedToken(input); 
    }

    @Query(() => Boolean)
    public async uniswapDeploy() {
        this.tokenService.deployTokenWithUniswap({ contractHash: "00cf03f0226dd9c6b41ee4acf4282b79174f7b695409773802004558e8201f3e", address: "0x986F8A4dCd2b481dAdf469A58A9c6d23Ad9482E1" } as any)
        return true; 
    }    

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    public async createToken(@UserId() userId:string) {
        return await this.tokenService.create(userId);
    }
}