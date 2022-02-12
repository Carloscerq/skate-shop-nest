import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { hash } from "bcrypt";
import { Order } from "../../orders/entities/order.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    address: string;

    @Column()
    complement: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @OneToMany(() => Order, order => order.user, { onDelete: 'CASCADE' })
    orders: Order;

    @BeforeInsert()
    async hash() {
        this.password = await hash(this.password, 10);
    }
}
