import * as mongoose from "mongoose";

export interface IWalletModel {
    userId: mongoose.Types.ObjectId,
    address: string,
    privateKey: string,
}