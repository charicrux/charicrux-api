
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IUserModel } from '../interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import config from 'src/config';

export const UserId = createParamDecorator((_:unknown, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    const headers = context.getContext().req.headers; 
    const token = headers.authorization.slice(7);
    const jwtService = new JwtService({ 
        secret: config.jwt.jwtSecret,
        signOptions: {
          expiresIn: config.jwt.jwtExpire,
        }, });
    const data:IUserModel = jwtService.verify(token);
    return data._id;
  },
);