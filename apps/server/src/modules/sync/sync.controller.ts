import { Controller, Post, Body } from '@nestjs/common';
import { SyncService } from './sync.service';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('test')
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.syncService.helloWorld();
  }
}
