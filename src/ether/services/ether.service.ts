import { ConsoleLogger, Injectable } from "@nestjs/common";
import crypto from "crypto";
import ethers from "ethers";
import { generateTemplateFilesBatch, CaseConverterEnum } from "generate-template-files";
const solc = require("solc");
const path = require('path');
const fs = require('fs');

@Injectable()
export class EtherService {
    constructor() {}

    public async generateDynamicContract(name:string, symbol:string) : Promise<{ outputFileName:string, absolutePath:string }> {
        const identifier = name.toLowerCase().replace(/\s/g, "-");
        const outputFileName = `${identifier}-contract.sol`;
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

    public compileSmartContract(outputFileName:string, absolutePath:string) {
        const content = fs.readFileSync(absolutePath, 'utf8');
        const input = {
            language: 'Solidity',
            sources: {
              [ outputFileName ]: {
                  content
              }
            },
          };
        
        const output = solc.compile(JSON.stringify(input));
        console.log(output);
        //console.log(JSON.parse(output));
        return "hello world";
    }

    public async deploySmartContract() {
        // const contractName = 'Storage'
        // const constructorArgs = [] 

        // // Note that the script needs the ABI which is generated from the compilation artifact.
        // // Make sure contract is compiled and artifacts are generated
        // const artifactsPath = `browser/contracts/artifacts/${contractName}.json` // Change this for different path
    
        // const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        // // 'web3Provider' is a remix global variable object
        // const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    
        // let factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);
    
        // let contract = await factory.deploy(...constructorArgs);
    
        // console.log('Contract Address: ', contract.address);
    
        // // The contract is NOT deployed yet; we must wait until it is mined
        // await contract.deployed()
        // console.log('Deployment successful.')
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