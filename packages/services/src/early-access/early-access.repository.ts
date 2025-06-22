import { prisma } from "@repo/db";
import { EarlyAccessSignup } from "@repo/db";

export class EarlyAccessRepository {
  async createSignup(data: {
    name?: string;
    email: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }): Promise<EarlyAccessSignup> {
    return prisma.earlyAccessSignup.create({
      data: {
        name: data.name || null,
        email: data.email,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        referrer: data.referrer || null,
      },
    });
  }

  async findByEmail(email: string): Promise<EarlyAccessSignup | null> {
    return prisma.earlyAccessSignup.findUnique({
      where: { email },
    });
  }

  async getAllSignups(): Promise<EarlyAccessSignup[]> {
    return prisma.earlyAccessSignup.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getSignupCount(): Promise<number> {
    return prisma.earlyAccessSignup.count();
  }
}
