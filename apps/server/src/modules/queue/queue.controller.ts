import { Controller, Post, Body, Param } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post(':id/start')
  create(@Param('id') jobId: string, @Body() createUserDto: any) {
    console.log(createUserDto);
    // const x = new HelloWorld();
    // console.log(x);
    // return this.jobService.startJob({
    //   taskId: Number(jobId),
    //   userId: createUserDto.userId,
    // });
  }
}
