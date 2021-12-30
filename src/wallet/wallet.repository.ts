import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IWalletModel } from "./interfaces/wallet.interface";

@Injectable()
export class WalletRepository {
    constructor(
        @InjectModel('wallet')
        private readonly walletModel: Model<IWalletModel>,
    ) {}

    public async create(doc:IWalletModel) {
        return await this.walletModel.create(doc);
    }
}