import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { EAccountStatus } from 'src/user/enums/account-status.enum';
import { IUserModel } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const headers = ctx.getContext().req.headers; 
    if (headers.authorization) {
      try {
        const token = headers.authorization.slice(7);
        const data:IUserModel = this.jwtService.verify(token);
        if (!data) return false; 
        const [ user ] : IUserModel[] = await this.userService.findByEmail(data.email);
        if (user.status === EAccountStatus.ACTIVE) return true; 
        else return false; 
      } catch (e) {
        return false;
      }
    }
    return false;
  }
}