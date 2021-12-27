import { Module } from "@nestjs/common";
import { EtherService } from "./services/ether.service";


@Module({
    providers: [ EtherService ],
    exports: [ EtherService ]
})
export class EtherModule {};