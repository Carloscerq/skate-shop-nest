import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly produtsService: ProductsService,
  ) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const user = await this.usersService.findOne(createOrderDto.userId);
    const product = await this.produtsService.findOne(createOrderDto.productId);

    await this.produtsService.update(createOrderDto.productId, {
      amountInStock: product.amountInStock - createOrderDto.amount
    });

    return this.ordersService.create(createOrderDto, user, product);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);

    await this.produtsService.update(order.product.id, {
      amountInStock: order.product.amountInStock + order.amount
    });

    return this.ordersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getOrdersFromClient(@Param('id') id: string) {
    return await this.ordersService.getOrdersFromClient(await this.usersService.findOne(id));
  }


  @UseGuards(JwtAuthGuard)
  @Post(':id/pay')
  async pay(@Param('id') id: string) {
    return await this.ordersService.pay(id);
  }
}
