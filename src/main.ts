import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = 8000;
const localhost = `http://localhost:${port}`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port, () => {
    console.log(`Server running at ${localhost}`);
  });
}

bootstrap();
