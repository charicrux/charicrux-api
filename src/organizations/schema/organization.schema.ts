import * as mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    name: { type: String, required: true },
}, { timestamps: true });


OrganizationSchema.index({ "$**": "text" });
OrganizationSchema.index({ symbol: 1 }, { unique: true });
OrganizationSchema.index({ name: 1 }, { unique: true });

export { OrganizationSchema };