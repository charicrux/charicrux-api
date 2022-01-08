import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrganizationsResolver } from "./organizations.resolver";
import { OrganizationsService } from "./organizations.service";
import { OrganizationRepository } from "./repositories/organization.repository";
import { OrganizationSchema } from "./schema/organization.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "organization", schema: OrganizationSchema }
        ]),
    ],
    providers: [ 
        OrganizationsResolver, 
        OrganizationsService, 
        OrganizationRepository 
    ],
    exports: [ OrganizationRepository ]
})
export class OrganizationsModule {};