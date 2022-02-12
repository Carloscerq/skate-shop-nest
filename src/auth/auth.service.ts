import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { config as dotenvconfig } from 'dotenv';
import { payloadDto } from './dto/payload.dto';
dotenvconfig();

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<User> {
        try {
            const user = await this.usersService.findOneByEmail(email);
            if (!(await compare(password, user.password))) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async login(user: User, createRefreshToken: boolean = true) {
        const payload = { email: user.email, id: user.id };

        const token = await this.jwtService.sign({ ...payload, refreshToken: false });
        if (createRefreshToken) {
            const refreshToken = await this.jwtService.sign({ ...payload, refreshToken: true }, { expiresIn: process.env.JWT_REFRESH_TOKEN_TIME });
            return { token, refreshToken };
        }
        return { token };
    }

    async validateToken(token: string) {
        try {
            await this.jwtService.verify(token);
            return true;
        } catch (error) {
            return false;
        }
    }

    async getTokenInfo(token: string): Promise<payloadDto> {
        return <payloadDto>this.jwtService.decode(token);
    }

    hasTokenExpired(token: payloadDto): boolean {
        // get current date in unix format
        const currentDate = new Date();
        // token exp is stored in SECONDS(NumericDate) since epoch, not MILISECONDS!!!
        const tokenExpirationDate = new Date(token.exp * 1000);

        if (currentDate.getTime() > tokenExpirationDate.getTime()) return true;

        return false;
    }
}
