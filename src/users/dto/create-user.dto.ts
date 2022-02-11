import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    address: string;
    
    @IsOptional()
    complement: string;
    
    @IsNotEmpty()
    phone: string;
    
    @IsNotEmpty()
    password: string;
}
