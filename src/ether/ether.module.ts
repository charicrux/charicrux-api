import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import config from "../config";
import { EtherResolver } from "./ether.resolver";
import { EtherService } from "./services/ether.service";


@Module({
    imports: [
        JwtModule.register({
            secret: config.jwt.jwtSecret,
            signOptions: {
              expiresIn: config.jwt.jwtExpire,
            },
        }),
        UserModule,
    ],
    providers: [ EtherService, EtherResolver ],
    exports: [ EtherService ]
})
export class EtherModule {};