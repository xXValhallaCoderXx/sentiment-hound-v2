import { Module } from '@nestjs/common';
import { JobModule } from './modules/job/job.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, JobModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
