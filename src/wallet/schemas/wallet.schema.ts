import * as mongoose from "mongoose";

const PrivateKeySchema = new mongoose.Schema({
    key: { type: String, required: true },
    iv: { type: String, required: true },
})

const WalletSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    address: { type: String, required: true },
    privateKey: { type: PrivateKeySchema, required: true },
})

export { WalletSchema };