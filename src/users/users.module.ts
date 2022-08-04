import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersGrpcServerController } from './users-grpc-server/users-grpc-server.controller';

@Module({
  controllers: [UsersController, UsersGrpcServerController],
  providers: [UsersService],
})
export class UsersModule {}
