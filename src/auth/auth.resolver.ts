import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AggregatedUser } from "src/user/models/aggregated-user.model";
import { AuthService } from "./auth.service";
import { CreateUserDTO } from "./dto/create-user.dto";

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Mutation(() => AggregatedUser)
    async createUser(@Args('input') input: CreateUserDTO) : Promise<AggregatedUser> {
        return await this.authService.createUser(input);
    }
}