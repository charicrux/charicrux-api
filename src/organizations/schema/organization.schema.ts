import * as mongoose from "mongoose";
import { EOrganizationStatus } from "../enums/organization-status.enum";

const OrganizationSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true, default: "", },
    status: { type: String, required: true, default: EOrganizationStatus.APPROVED },
}, { timestamps: true });


OrganizationSchema.index({ name: "text", symbol: "text" });
OrganizationSchema.index({ symbol: 1 }, { unique: true });
OrganizationSchema.index({ name: 1 }, { unique: true });

export { OrganizationSchema };