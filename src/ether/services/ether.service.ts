import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import ethers from "ethers";

@Injectable()
export class EtherService {
    constructor() {}

    public generateAddress() : { address:string, privateKey:string } {
        const privateKey = this.generatePrivateKey();
        const { address } = new ethers.Wallet(privateKey);
        return { address, privateKey };
    }

    private generatePrivateKey() : string {
        const id = crypto.randomBytes(32).toString('hex');
        const privateKey = `0x${id}`;
        return privateKey; 
    }
}