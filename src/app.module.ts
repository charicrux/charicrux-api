import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EtherModule } from './ether/ether.module';
import config from "./config";
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
const { join } = require('path');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useFactory: () => ({
        debug: isDevelopment,
        playground: isDevelopment,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
      })
    }),
    JwtModule.register({
      secret: config.jwt.jwtSecret,
      signOptions: {
        expiresIn: config.jwt.jwtExpire,
      },
    }),
    MongooseModule.forRoot(config.mongodb.uri, config.mongodb.options),
    EtherModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
