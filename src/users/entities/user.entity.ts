import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn } from "typeorm";
import { hash } from "bcrypt";

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

    @BeforeInsert()
    async hash() {
        this.password = await hash(this.password, 10);
    }
}
