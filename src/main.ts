import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable Cross-Origin Resource Sharing for frontend calls
  app.enableCors({
    origin: '*', // For rapid development prototyping phase
  });

  await app.listen(3000);
}
bootstrap();
