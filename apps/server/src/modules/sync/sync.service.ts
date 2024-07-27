import { Injectable } from '@nestjs/common';
import { integrationsService } from 'services';

@Injectable()
export class SyncService {
  constructor() {}

  async helloWorld() {
    const result = await integrationsService.getUserIntegration('3331', 'dd');
    console.log(result);
    return {
      hello: result,
    };
  }
}
