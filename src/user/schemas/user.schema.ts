import * as mongoose from "mongoose";
import { ERoles } from "src/auth/constants/roles.constants";
import { EAccountStatus } from "../enums/account-status.enum";

const UserSchema = new mongoose.Schema({
    email: {  type: String, required: true },
    pass: { type: String, required: false, default: null },
    avatar: { type: String, required: false, default: null },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    roles: { type: Array, required: true, default: [ ERoles.USER ]},
    status: { type: String, required: true, default: EAccountStatus.ACTIVE },
    emailVerified: { type: Boolean, required: false, default: false },

}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });

export { UserSchema }