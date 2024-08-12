import { Controller, Post, Body } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('test')
  create(@Body() createUserDto: any) {
    console.log(createUserDto);
    return this.syncService.helloWorld();
  }
}
