import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { payloadDto } from '../dto/payload.dto';
import { config as dotenvconfig } from 'dotenv';
dotenvconfig();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: payloadDto) {
        // Make sure the that the token is not a refresh token
        if (payload.refreshToken) throw new UnauthorizedException();

        return payload;
    }
}
