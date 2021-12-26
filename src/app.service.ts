import { Injectable } from '@nestjs/common';
import { EtherService } from './ether/services/ether.service';

@Injectable()
export class AppService {
  constructor(
    private readonly etherService: EtherService
  ) {}
  async getHello(): Promise<string> {
    await this.etherService.generateDynamicContract("South Brunswick School District", "SBSD").then(({ outputFileName, absolutePath }) => {
        this.etherService.compileSmartContract().then(e => {
          console.log(e);
        });

        this.etherService.deploySmartContract(outputFileName);
    })
    return 'Hello World!';
  }
}
