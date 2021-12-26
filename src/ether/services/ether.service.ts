import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import ethers from "ethers";
import { generateTemplateFilesBatch, CaseConverterEnum } from "generate-template-files";
const path = require('path');

@Injectable()
export class EtherService {
    constructor() {}

    public generateDynamicContract() : { outputFileName:string, absolutePath:string } {
        // const randomInt = Math.random().toString();
        // const timestamp = Date.now().toString();
        // const outputFileName = `${timestamp}-${randomInt}-contract.sol`;

        const outputFileName = "contract.sol";
        const absolutePath = path.join(__dirname, `../temp/${outputFileName}`)
        generateTemplateFilesBatch([{
            option: "Dynamic Ethereum Contract",
            defaultCase: CaseConverterEnum.None,
            entry: {
                folderPath: path.join(__dirname, "../templates", "contract.sol"),
            },
            dynamicReplacers: [
                {slot:'__name__', slotValue: "South Brunswick School District"},
                {slot:'__symbol__', slotValue: "SBSD"}
            ],
            output: {
                path: absolutePath,
                pathAndFileNameDefaultCase: CaseConverterEnum.KebabCase,
                overwrite: true,
              },
        }]);
        return { outputFileName, absolutePath };
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