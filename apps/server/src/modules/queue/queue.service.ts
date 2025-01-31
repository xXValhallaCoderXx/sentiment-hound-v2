import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class QueueService {
  constructor() {}

  async startJob(data: any) {
    console.log(data);
    try {
      return {
        hello: {
          world: 'sss',
        },
      };
    } catch (e) {
      throw new HttpException(
        'This is a custom message',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
