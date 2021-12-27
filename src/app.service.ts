import { Injectable } from '@nestjs/common';
import { EtherService } from './ether/services/ether.service';

@Injectable()
export class AppService {
  constructor(
    private readonly etherService: EtherService
  ) {}
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
