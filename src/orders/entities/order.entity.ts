import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";
import  { Product } from "../../products/entities/product.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: false })
    isPaid: boolean;

    @Column()
    amount: number;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @ManyToOne(() => Product, product => product.orders)
    product: Product;
}
