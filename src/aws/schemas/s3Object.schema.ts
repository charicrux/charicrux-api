import * as mongoose from "mongoose";

const S3ObjectSchema = new mongoose.Schema({
    key: { type:String, required: true},
    bucket: { type:String, required: true },
});

export { S3ObjectSchema };