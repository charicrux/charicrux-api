import { Injectable } from '@nestjs/common';
import { EtherService } from './ether/services/ether.service';

@Injectable()
export class AppService {
  constructor(
    private readonly etherService: EtherService
  ) {}
  async getHello(): Promise<string> {
    // await this.etherService.generateDynamicContract("South Brunswick School District Test", "SBSDT").then(async ({ absolutePath, outputFileName }) => {
    //   const { bytecode, interface:contractInterface } = await this.etherService.compileSmartContractWithSolidity(absolutePath)
    //   this.etherService.deploySmartContract(contractInterface, bytecode);
    // });

    return 'Hello World!';
  }
}
