import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Resolver, Query } from "@nestjs/graphql";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getRoot(): Promise<string> {
    return await this.appService.getRoot();
  }
}
