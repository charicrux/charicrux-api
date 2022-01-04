import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IWalletModel } from "./interfaces/wallet.interface";
import * as mongoose from "mongoose";

@Injectable()
export class WalletRepository {
    constructor(
        @InjectModel('wallet')
        private readonly walletModel: Model<IWalletModel>,
    ) {}

    public async create(doc:IWalletModel) {
        return await this.walletModel.create(doc);
    }

    public async findByUserId(userId:string) {
        return await this.walletModel.findOne({ userId: new mongoose.Types.ObjectId(userId)});
    }
}