import { Injectable } from "@nestjs/common";
import { generateTemplateFilesBatch, CaseConverterEnum } from "generate-template-files";
const { exec } = require("child_process");
const path = require('path');
const crypto = require("crypto");
const ethers = require("ethers");
const hre = require("hardhat");

@Injectable()
export class EtherService {
    constructor() {}

    public async generateDynamicContract(name:string, symbol:string) : Promise<{ outputFileName:string, absolutePath:string }> {
        const identifier = name.replace(/\s/g, "");
        const outputFileName = `${identifier}Contract.sol`;
        const absolutePath = path.join(__dirname, `../contracts/${outputFileName}`)
        
        await generateTemplateFilesBatch([{
            option: "Dynamic Ethereum Contract",
            defaultCase: CaseConverterEnum.None,
            entry: {
                folderPath: path.join(__dirname, "../templates", "contract.sol"),
            },
            dynamicReplacers: [
                {slot:'__name__', slotValue: name},
                {slot:'__symbol__', slotValue: symbol}
            ],
            output: {
                path: absolutePath,
                pathAndFileNameDefaultCase: CaseConverterEnum.KebabCase,
                overwrite: false,
            },
        }]);

        return { outputFileName, absolutePath };
    }

    public compileSmartContract() : Promise<boolean> {
        const cmd = ["npx", "hardhat", "compile"]; 
        return new Promise((resolve, _) => {
            exec(cmd.join(" "), { maxBuffer: 1024 * 500 }, (_error:boolean, stdout:boolean, _stderr:boolean) => {
              resolve(stdout ? true : false);
            });
        });
    }

    public async deploySmartContract(contractFileName) {
        const [ deployer ] = await hre.ethers.getSigners(); 
        const contract = contractFileName.split(/\.sol$/)[0];

        console.log("Deploying contracts with the account:", deployer.address); 

        const FactoryNFT = await hre.ethers.getContractFactory(contract); 
        const factoryNFT = await FactoryNFT.deploy(); 

        await factoryNFT.deployed(); 

        console.log("FactoryNFT deployed to:", factoryNFT.address);
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