import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (await this.userRepository.findOne({ where: { email: createUserDto.email } })) throw new BadRequestException("Email already in use");

    const user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException("User not found");
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);
    await this.userRepository.save({ ...user, ...updateUserDto });
    return user;
  }

  async remove(id: string): Promise<DeleteResult> {
    if (await this.findOne(id)) {
      return await this.userRepository.delete(id);
    }

    throw new BadRequestException("User not found");
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new BadRequestException("User not found");
    return user;
  }
}
