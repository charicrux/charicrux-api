import * as mongoose from "mongoose";
import config from "src/config";
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
    network: { type: String, required: true, default: config.etherNetwork },
    organizationId: { type: mongoose.Types.ObjectId, required: true },
});

TokenSchema.index({ organizationId: 1, network: 1 }, { unique: true });

export { TokenSchema }