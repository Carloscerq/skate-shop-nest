import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export interface loginDto extends Request {
    user: User;
}