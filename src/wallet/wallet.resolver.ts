import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Float } from "@nestjs/graphql";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UserId } from "src/user/decorators/user.decorator";
import { WalletService } from "./wallet.service";

@Resolver()
export class WalletResolver {
    constructor(
        private readonly walletService: WalletService
    ) {}

    @UseGuards(AuthGuard)
    @Query(() => Float)
    public async getWalletBalance(@UserId() userId) {
        return await this.walletService.getBalance(userId);
    }

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async getWalletPrivateKey(@UserId() userId) {
        return await this.walletService.getPrivateKey(userId);
    }
}