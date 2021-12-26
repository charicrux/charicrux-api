import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EtherModule } from './ether/ether.module';

@Module({
  imports: [
    EtherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
