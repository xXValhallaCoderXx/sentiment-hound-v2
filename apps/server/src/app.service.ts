import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const x = await prisma.user.findMany()
    console.log("PRISMA: ", x)
    return 'Hello World!';
  }
}
