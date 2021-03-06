import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import config from "src/config";
import { EtherModule } from "src/ether/ether.module";
import { UserModule } from "src/user/user.module";
import { TokenSchema } from "./schemas/token.schema";
import { TokenRespository } from "./repositories/token.repository";
import { TokenResolver } from "./token.resolver";
import { TokenService } from "./services/token.service";
import { ContractSchema } from "./schemas/contract.schema";
import { ContractRepository } from "./repositories/contract.repository";
import { ContractService } from "./services/contract.service";
import { AWSModule } from "src/aws/aws.module";
import { WalletModule } from "src/wallet/wallet.module";
import { OrganizationsModule } from "src/organizations/organizations.module";
import { PositionsSchema } from "./schemas/positions.schema";
import { PositionsRepository } from "./repositories/postions.repository";
import { PositionsService } from "./services/positions.service";

@Module({
    imports: [
        JwtModule.register({
            secret: config.jwt.jwtSecret,
            signOptions: {
              expiresIn: config.jwt.jwtExpire,
            },
        }),
        MongooseModule.forFeature([
            { name: "token", schema: TokenSchema },
            { name: "contract", schema: ContractSchema },
            { name: "position", schema: PositionsSchema },
        ]),
        UserModule,
        EtherModule,
        AWSModule,
        OrganizationsModule,
        WalletModule,
        AWSModule,
    ],
    providers: [ 
        TokenService, 
        TokenResolver, 
        TokenRespository,
        PositionsRepository,
        PositionsService,
        ContractService,
        ContractRepository,
    ],
    exports: [],
})
export class TokenModule {};