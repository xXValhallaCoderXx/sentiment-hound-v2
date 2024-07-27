import { Controller, Post, Body } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ICreateSyncDTO } from 'services';
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('test')
  create(@Body() createUserDto: ICreateSyncDTO) {
    console.log(createUserDto);
    return this.syncService.helloWorld();
  }
}
