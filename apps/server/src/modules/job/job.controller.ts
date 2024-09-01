import { Controller, Post, Body, Param } from '@nestjs/common';
import { JobService } from './job.service';
// import { HelloWorld } from 'services/src/task/task.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

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
