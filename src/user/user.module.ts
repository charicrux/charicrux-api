import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./user.service";
import { WalletModule } from "src/wallet/wallet.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'user', schema: UserSchema }
        ]),
        WalletModule,
    ],
    providers: [ UserService, UserRepository ],
    exports: [ UserService ]
})
export class UserModule {}