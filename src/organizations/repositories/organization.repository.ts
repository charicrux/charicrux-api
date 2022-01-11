import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model  } from "mongoose";
import { getOrganizationAggregation } from "../aggregations/organization.aggregation";
import { EOrganizationStatus } from "../enums/organization-status.enum";
import { IOrganization } from "../interfaces/organization.interface";

@Injectable()
export class OrganizationRepository {
    constructor(
        @InjectModel('organization')
        private readonly organizationModel: Model<IOrganization>,
    ) {}

    async getAggregatedOrganizationsByQuery(query:string) {
        const $match = { $text: { $search: query }, status: EOrganizationStatus.APPROVED };
        return await this.organizationModel.aggregate(getOrganizationAggregation($match));
    }

    async getAggregatedOrganizations() {
        return await this.organizationModel.aggregate(getOrganizationAggregation({
            status: EOrganizationStatus.APPROVED
        }));
    }

    async create(doc:IOrganization) {
        return await this.organizationModel.create(doc);
    }

    async getOrganizations() {
        return await this.organizationModel.find({ status: EOrganizationStatus.APPROVED }).limit(10);
    }

    async findOrganizationById(_id:string) {
        return await this.organizationModel.findOne({ _id });
    }

    async getOrganizationByQuery(query:string) {
        return await this.organizationModel.find({
            status: EOrganizationStatus.APPROVED,
            $text: { 
                 $search: query, 
                 $caseSensitive: false 
            }
        }).limit(10);
    }
}