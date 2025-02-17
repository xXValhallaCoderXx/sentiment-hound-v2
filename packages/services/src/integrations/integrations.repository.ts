import { IIntegrationRepository, IIntegration } from "./integrations.interface";

export class IntegrationRepository implements IIntegrationRepository {
  constructor(private prisma: any) {}

  async create(integration: Partial<IIntegration>): Promise<IIntegration> {
    return this.prisma.integration.create({ data: integration });
  }

  async findById(id: number): Promise<IIntegration | null> {
    return this.prisma.integration.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<IIntegration[]> {
    return this.prisma.integration.findMany({
      where: { userId },
      include: { provider: true },
    });
  }

  async update(id: number, data: Partial<IIntegration>): Promise<IIntegration> {
    return this.prisma.integration.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.integration.delete({ where: { id } });
  }
}
