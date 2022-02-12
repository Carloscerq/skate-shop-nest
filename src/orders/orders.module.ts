import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [UsersModule, TypeOrmModule.forFeature([Order]), ProductsModule]
})
export class OrdersModule {}
