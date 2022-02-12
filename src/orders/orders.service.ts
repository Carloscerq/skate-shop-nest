import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) { }

  async create(createOrderDto: CreateOrderDto, user: User, product: Product): Promise<Order> {
    const order = await this.orderRepository.create(createOrderDto);
    order.user = user;
    order.product = product;


    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne(id, { relations: ['user', 'product'] });

    if (!order) throw new BadRequestException('Order not found');
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    await this.orderRepository.save({ ...order, ...updateOrderDto });
    return order;
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.orderRepository.delete(id);
  }

  async getOrdersFromClient(user: User): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['product'], where: { user } });
  }
}
