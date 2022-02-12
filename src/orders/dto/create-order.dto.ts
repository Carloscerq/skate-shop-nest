import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    productId: string;
}
