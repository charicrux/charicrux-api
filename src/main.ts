import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import config from "./config";
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

  app.use(helmet({ contentSecurityPolicy: isDevelopment ? false : undefined }));
  app.use(
    rateLimit({
      windowMs: 1000, 
      max: 100, 
    }),
  );
  if (isDevelopment) {
    app.enableCors();
  } else {
    app.enableCors({
      origin: [config?.origin?.whitelist],
    });
  }
  app.use(morgan("tiny"))

  await app.listen(config.port);
}
bootstrap();
