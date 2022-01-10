import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import config from "src/config";
import { EtherModule } from "src/ether/ether.module";
import { UserModule } from "src/user/user.module";
import { WalletSchema } from "./schemas/wallet.schema";
import { WalletRepository } from "./wallet.repository";
import { WalletResolver } from "./wallet.resolver";
import { WalletService } from "./wallet.service";


@Module({
    imports: [ 
        JwtModule.register({
            secret: config.jwt.jwtSecret,
            signOptions: {
              expiresIn: config.jwt.jwtExpire,
            },
        }),
        forwardRef(() => EtherModule),
        forwardRef(() => UserModule),
        MongooseModule.forFeature([
            { name: 'wallet', schema: WalletSchema }
        ]),
    ],
    exports: [ WalletService, WalletRepository ],
    providers: [ WalletService, WalletRepository, WalletResolver ]
})
export class WalletModule {};