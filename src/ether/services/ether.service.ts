import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import ethers from "ethers";
import { generateTemplateFiles, CaseConverterEnum } from "generate-template-files";
const path = require('path');

@Injectable()
export class EtherService {
    constructor() {}

    public generateDynamicContract() {
        generateTemplateFiles([{
            option: "Dynamic Ethereum Contract",
            defaultCase: CaseConverterEnum.PascalCase,
            entry: {
                folderPath: path.join(__dirname, "../templates", "contract.sol"),
            },
            stringReplacers: ['__store__', { question: 'Insert model name', slot: '__model__' }],
            output: {
                path: path.join(__dirname, "../contracts"),
                pathAndFileNameDefaultCase: CaseConverterEnum.KebabCase,
                overwrite: false,
              },
        }])
    }

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