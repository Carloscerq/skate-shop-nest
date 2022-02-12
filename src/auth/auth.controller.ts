import { Controller, Post, UseGuards, Req, Get, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { loginDto } from './dto/login.dto';
import { JwtStrategy } from './stategy/jwt.strategy';
import { refreshTokenDto } from './dto/refreshToken.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) { }
    
    @UseGuards(LocalAuthGuard)
    @Post()
    async login(@Req() req: loginDto) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtStrategy)
    @Get('protected')
    protectedResource() {
        return 'JWT is working!';
    }

    @Post('refresh-token')
    async refreshToken(@Body() req: refreshTokenDto) {
        if (!await this.authService.validateToken(req.refreshToken)) throw new UnauthorizedException();

        const tokenInfo = await this.authService.getTokenInfo(req.refreshToken);
        const user = await this.userService.findOneByEmail(tokenInfo.email);
        if (this.authService.hasTokenExpired(tokenInfo)) return this.authService.login(user);

        return this.authService.login(user, false);
    }
}
