import * as mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    address: { type: String, required: true },
    privateKey: { type: String, required: true },
})

export { WalletSchema };