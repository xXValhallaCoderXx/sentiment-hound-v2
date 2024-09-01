import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { integrationsService } from 'services';

@Injectable()
export class SyncService {
  constructor() {}

  async helloWorld() {
    const result = await integrationsService.getUserIntegration({
      userId: '3331',
      name: 'dd',
    });
    try {
      //   await syncService.fullSyncUserIntegration({
      //     userId: '3331',
      //     name: 'dd',
      //   });

      return {
        hello: result,
      };
    } catch (e) {
      throw new HttpException(
        'This is a custom message',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
