/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotFoundException } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './../dto/create-user.dto';
import { UsersService } from './../users.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall, status } from '@grpc/grpc-js';

class UpdateUserDto extends PartialType(CreateUserDto) {
  id: string;
}

@Controller()
export class UsersGrpcServerController {
  constructor(private usersService: UsersService) {}

  @GrpcMethod('UserService')
  create(
    data: CreateUserDto,
    _metadata: Metadata,
    _call: ServerUnaryCall<any, any>,
  ) {
    return this.usersService.create(data);
  }

  @GrpcMethod('UserService')
  update(
    data: UpdateUserDto,
    _metadata: Metadata,
    _call: ServerUnaryCall<any, any>,
  ) {
    const { id, ...rest } = data;
    try {
      return this.usersService.update(id, rest);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          code: status.NOT_FOUND,
        });
      }
    }
  }

  @GrpcMethod('UserService', 'FindOne')
  findOne(data: { id: string }) {
    try {
      return this.usersService.findOne(data.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          code: status.NOT_FOUND,
        });
      }
    }
  }

  @GrpcMethod('UserService', 'FindAll')
  findAll(_data: any) {
    const users = this.usersService.findAll();
    return { data: users };
  }

  @GrpcMethod('UserService', 'Delete')
  remove(data: { id: string }) {
    try {
      this.usersService.remove(data.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          code: status.NOT_FOUND,
        });
      }
    }
  }
}
