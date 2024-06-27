import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MyLib } from 'hello-world';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    const myLib = new MyLib();
    const result = this.appService.getHello();
    return {
      data: result,
      success: myLib.hello(),
    };
  }
}
