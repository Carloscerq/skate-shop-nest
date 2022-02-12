import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config as dotenvconfig } from 'dotenv';
import { UsersModule } from 'src/users/users.module';
import { LocalStategy } from './stategy/local.stategy';
import { JwtStrategy } from './stategy/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
dotenvconfig();

@Module({
  imports: [PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_TIME },
  }), UsersModule],
  providers: [AuthService, LocalStategy, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtModule, JwtAuthGuard]
})
export class AuthModule { }
