import {
  IntegrationsRepository,
  integrationsRepository,
} from "../integrations/integrations.repository";
import { jobRepository, JobRepository } from "./job.repository";

class JobService {
  constructor(private jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }
  async fullSyncUserIntegration(data: any) {
    return "";
  }
}

export const jobService = new JobService(jobRepository);
