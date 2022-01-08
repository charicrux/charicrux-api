import * as mongoose from "mongoose";
import { ETokenStatus } from "../enums/token-status.enum";

const TokenVariableSchema = new mongoose.Schema({
    slot: { type: String, required: true },
    slotValue: { type: mongoose.Schema.Types.Mixed, required: true },
});

const TokenSchema = new mongoose.Schema({
    status: { type: String, required: true, default: ETokenStatus.CREATED },
    address: { type: String, required: false, default: null },
    contractHash: { type: String, required: true },
    injectedVariables: { type: [ TokenVariableSchema ], required: true, default: [] },
    organizationId: { type: mongoose.Types.ObjectId, required: true },
});

TokenSchema.index({ organizationId: 1 }, { unique: true });

export { TokenSchema }