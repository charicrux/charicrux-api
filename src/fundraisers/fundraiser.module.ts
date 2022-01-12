import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import config from "src/config";
import { UserModule } from "src/user/user.module";
import { FundraiserResolver } from "./fundraiser.resolver";
import { FundraiserService } from "./fundraiser.service";
import { FundraiserRepository } from "./repositories/fundraiser.repository";
import { FundraiserSchema } from "./schemas/fundraiser.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "fundraiser", schema: FundraiserSchema }
        ]),
        JwtModule.register({
            secret: config.jwt.jwtSecret,
            signOptions: {
              expiresIn: config.jwt.jwtExpire,
            },
        }),
        UserModule,
    ],
    providers: [ FundraiserResolver, FundraiserService, FundraiserRepository, ],
    exports: [],
})
export class FundraiserModule {};