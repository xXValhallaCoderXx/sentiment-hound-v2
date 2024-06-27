import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MyLib } from 'hello-world';
import { PrismaClient } from 'database';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    const myLib = new MyLib();
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany();
    const result = this.appService.getHello();
    return {
      data: result,
      success: myLib.hello(),
      users,
    };
  }
}
