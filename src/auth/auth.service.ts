import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { UserService } from "src/user/user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { SignOptions } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    public async createUser({ pass, ...fields} : CreateUserDTO) {
        const hashedPassword = await this.hashPassword(pass);
        const response = await this.userService.create({ pass:hashedPassword, ...fields }).catch(_ => null);
        
        if (!response) return new InternalServerErrorException('Failed to Create Account');
        const clientObject = await this.clientObject(response._id);
        return clientObject;
    }

    private async clientObject(_id:string) {
        const [ aggregatedUser ] = await this.userService.getAggregatedUser(_id);
        const { email, ...user } = aggregatedUser; 
        const data = { _id, email };
        const accessToken = await this.generateAccessToken(data, {});
        return { ...user, email, accessToken };
    }

    private async hashPassword(pass:string) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(pass, salt);
    }

    private async generateAccessToken(data, options?: SignOptions) {
        return this.jwtService.sign(data, options);
    }
}