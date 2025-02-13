import { Controller, Post, Body } from '@nestjs/common';
// import { TaskService } from './task.service';
import { CreateTaskDto } from './tasks.dto';

@Controller('tasks')
export class TaskController {
  //   constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    console.log('CREATE TAKS: ', createTaskDto);
    // return this.taskService.create(createTaskDto);
    return '';
  }

  //   @Get()
  //   findAll(@Query('status') status: string) {
  //     return this.taskService.findAll(status);
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.taskService.findOne(id);
  //   }

  //   @Put(':id')
  //   update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //     return this.taskService.update(id, updateTaskDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.taskService.remove(id);
  //   }
}
