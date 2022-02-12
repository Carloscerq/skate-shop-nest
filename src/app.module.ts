import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config as dotenvconfig } from 'dotenv';
import { OrdersModule } from './orders/orders.module';
dotenvconfig();

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/**/*.migration{.ts,.js}"],
    cli: {
      migrationsDir: "src/migrations/*.{ts,js}",
    },
    subscribers: ["src/subscribers/**/*.{ts,js}"],
  }),UsersModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
