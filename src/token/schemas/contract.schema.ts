import * as mongoose from "mongoose";
import { S3ObjectSchema } from "src/aws/schemas/s3Object.schema";

const ContractSchema = new mongoose.Schema({
    contractHash: { type: String, required: true },
    aws:{ type: S3ObjectSchema, required: true },
});

ContractSchema.index({ contractHash: 1 }, { unique: true });

export { ContractSchema }