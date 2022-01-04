import { Injectable } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

@Injectable()
@Resolver()
export class AppService {
  constructor() {}
  @Query(() => String)
  async getRoot(): Promise<string> {
    //const privateKeyExample = "0x110526fdbe3fc57bc97044f156b71d2362c2d4976b8a3d27a07e2f525c038528";
    //const balance = await this.etherService.getWalletBalance(privateKeyExample); // config.cryptoRootWallet.privateKey
    //console.log(balance);
    return 'All Systems Operational.<br/>200 OK';
  }
}
