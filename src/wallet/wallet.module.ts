import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EtherModule } from "src/ether/ether.module";
import { WalletSchema } from "./schemas/wallet.schema";
import { WalletRepository } from "./wallet.repository";
import { WalletService } from "./wallet.service";


@Module({
    imports: [ 
        EtherModule,
        MongooseModule.forFeature([
            { name: 'wallet', schema: WalletSchema }
        ]),
    ],
    exports: [ WalletService ],
    providers: [ WalletService, WalletRepository ]
})
export class WalletModule {};