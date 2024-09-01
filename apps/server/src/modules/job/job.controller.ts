import { Controller, Post, Body, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { IStartUserTaskDTO } from 'services/src/task/task.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post(':id/start')
  create(@Param('id') jobId: string, @Body() createUserDto: IStartUserTaskDTO) {
    console.log(createUserDto);

    // return this.jobService.startJob({
    //   taskId: Number(jobId),
    //   userId: createUserDto.userId,
    // });
  }
}
