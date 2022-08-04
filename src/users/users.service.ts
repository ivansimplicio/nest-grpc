import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(data: CreateUserDto): User {
    const newUser = { ...data, id: uuid() };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  update(id: string, data: UpdateUserDto): User {
    const user = this.findOne(id);
    const index = this.users.indexOf(user);
    this.users[index] = { ...user, ...data };
    return this.users[index];
  }

  remove(id: string): void {
    const user = this.findOne(id);
    const index = this.users.indexOf(user);
    this.users.splice(index, 1);
  }
}
