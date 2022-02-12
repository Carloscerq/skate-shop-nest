import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "../../orders/entities/order.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    amountInStock: number;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Order, order => order.product)
    orders: Order[];
}
