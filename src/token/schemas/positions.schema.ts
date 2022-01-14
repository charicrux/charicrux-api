import * as mongoose from "mongoose";

const PositionsSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    tokenId: { type: mongoose.Types.ObjectId, required: true },
}, { 
    timestamps: true
})

PositionsSchema.index({ userId: 1, tokenId: 1 }, { unique: true });

export { PositionsSchema };