import { Injectable } from "@nestjs/common";
import { WalletRepository } from "./wallet.repository";
import * as mongoose from "mongoose";
import { EtherService } from "src/ether/services/ether.service";

@Injectable()
export class WalletService {
    constructor(
        private readonly etherService: EtherService,
        private readonly walletRepo: WalletRepository,
    ) {}

    public async create(userId:mongoose.Types.ObjectId) {
        const { address, privateKey } = this.etherService.generateAddress();
        return this.walletRepo.create({ userId, address, privateKey });
    }
}