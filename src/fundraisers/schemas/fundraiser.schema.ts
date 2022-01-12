import * as mongoose from "mongoose";
import { EFundraiserStatus } from "../enums/fundraiser-status.enum";

const FundraiserSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    purpose: { type: String, required: true },
    goal: { type: Number, required: true },
    organizationId: { type: mongoose.Types.ObjectId, required: true  },
    status: { type: String, required: true, default: EFundraiserStatus.ACTIVE }
}, { timestamps: true });

FundraiserSchema.index({ name: "text", purpose: "text" }, { weights: { 
    name: 10,
    purpose: 5,
}});

export { FundraiserSchema };