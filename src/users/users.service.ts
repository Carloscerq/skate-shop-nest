import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      if (await this.findOneByEmail(createUserDto.email)) throw new BadRequestException("Email already in use");

      const user = await this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new BadRequestException("Could not create user");
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!(await this.findOneByEmail(updateUserDto.email))) throw new BadRequestException("User not found");

    try {
      const user = await this.userRepository.findOne(id);
      await this.userRepository.save({ ...user, ...updateUserDto });
      return user;
    } catch (error) {
      throw new BadRequestException("Could not update user");
    }
  }

  async remove(id: string) {
    if (await this.findOne(id)) {
      try {
        return await this.userRepository.delete(id);
      } catch (error) {
        throw new BadRequestException("Could not delete user");
      }
    }

    throw new BadRequestException("User not found");
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}
