import { Injectable } from "@nestjs/common";
import { WalletRepository } from "./wallet.repository";
import * as mongoose from "mongoose";
import { EtherService } from "src/ether/services/ether.service";
import config from "src/config";
const crypto = require("crypto");

@Injectable()
export class WalletService {
    constructor(
        private readonly etherService: EtherService,
        private readonly walletRepo: WalletRepository,
        //private readonly authService: AuthService,
    ) {}

    public async getBalance(userId:string) {
        const { privateKey } = await this.walletRepo.findByUserId(userId);
        const decryptedKey = this.decryptWithAES(privateKey.key, privateKey.iv);
        return await this.etherService.getWalletBalance(decryptedKey);
    }

    public async create(userId:mongoose.Types.ObjectId) {
        const { address, privateKey } = this.etherService.generateAddress();
        const privateKeyPacket = this.encryptWithAES(privateKey);
        return this.walletRepo.create({ userId, address, privateKey:privateKeyPacket });
    }

    public async getPrivateKey(userId:mongoose.Types.ObjectId) {
        const { privateKey } = await this.walletRepo.findByUserId(userId.toString());
        const decryptedKey = this.decryptWithAES(privateKey.key, privateKey.iv);
        return decryptedKey; 
    }

    private decryptWithAES(encryptedKey:string, hexIV:string) {
        const key = config?.crypto?.key; 
        let iv = Buffer.from(hexIV, 'hex');
        let encryptedText = Buffer.from(encryptedKey, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    private encryptWithAES(text:string) {
        const iv = crypto.randomBytes(16);
        const key = config?.crypto?.key; 
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const serialized = { key: encrypted.toString('hex'), iv: iv.toString('hex') };
        return serialized;
    }
}