"use server";

import { prisma } from "@repo/db";
import {
  CoreProviderService,
  ProviderRepository,
  CreateProviderDto,
  UpdateProviderDto,
} from "@repo/services";
import { Provider } from "@repo/db";

// Create a repository implementation
const providerRepository = new ProviderRepository(prisma);
const providerService = new CoreProviderService(providerRepository);

export async function getProviders(): Promise<Provider[]> {
  try {
    return await providerService.getAllProviders();
  } catch (error) {
    throw new Error("Failed to fetch providers");
  }
}

export async function getProvider(id: string): Promise<Provider> {
  try {
    return await providerService.getProvider(id);
  } catch (error) {
    throw new Error("Failed to fetch provider");
  }
}

export async function createProvider(
  data: CreateProviderDto
): Promise<Provider> {
  try {
    return await providerService.createProvider(data);
  } catch (error) {
    throw new Error("Failed to create provider");
  }
}

export async function updateProvider(
  id: string,
  data: UpdateProviderDto
): Promise<Provider> {
  try {
    return await providerService.updateProvider(id, data);
  } catch (error) {
    throw new Error("Failed to update provider");
  }
}

export async function deleteProvider(
  id: string
): Promise<{ success: boolean }> {
  try {
    await providerService.deleteProvider(id);
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete provider");
  }
}
