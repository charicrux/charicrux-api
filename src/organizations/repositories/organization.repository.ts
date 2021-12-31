import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model  } from "mongoose";
import { IOrganization } from "../interfaces/organization.interface";

@Injectable()
export class OrganizationRepository {
    constructor(
        @InjectModel('organization')
        private readonly organizationModel: Model<IOrganization>,
    ) {}

    async getOrganizations() {
        return await this.organizationModel.find().limit(10);
    }

    async getOrganizationByQuery(query:string) {
        return await this.organizationModel.find({
            $text: { 
                 $search: query, 
                 $caseSensitive: false 
            }
        }).limit(10);
    }
}