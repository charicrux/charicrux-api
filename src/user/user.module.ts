import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'user', schema: UserSchema }
        ]),
    ],
    providers: [ UserService, UserRepository ],
    exports: [ UserService ]
})
export class UserModule {}