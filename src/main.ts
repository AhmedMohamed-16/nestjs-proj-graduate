import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FilterFilter } from './common/filters/filter/filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  //const httpAdapter = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new FilterFilter(httpAdapter));
  await app.listen(3000);
}
bootstrap();
