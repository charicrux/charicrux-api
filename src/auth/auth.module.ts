import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import config from "src/config";
import { UserModule } from "src/user/user.module";
import { WalletModule } from "src/wallet/wallet.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        JwtModule.register({
            secret: config.jwt.jwtSecret,
            signOptions: {
              expiresIn: config.jwt.jwtExpire,
            },
        }),
        UserModule,
        WalletModule,
    ],
    exports: [ AuthResolver ],
    providers: [ AuthResolver, AuthService ],
})
export class AuthModule {};