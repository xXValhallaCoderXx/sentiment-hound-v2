import { PrismaClient, Prisma } from "@repo/db";

export type PrismaModels = keyof Omit<
  PrismaClient,
  | "$connect"
  | "$disconnect"
  | "$on"
  | "$transaction"
  | "$use"
  | "$extends"
  | "$queryRaw"
  | "$executeRaw"
>;

/**
 * Base repository class that provides common CRUD operations for Prisma models
 */
export class BaseRepository<ModelName extends PrismaModels> {
  protected readonly prismaModel: any;

  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: ModelName,
  ) {
    this.prismaModel = this.prisma[this.modelName];
  }

  /**
   * Create a new record
   */
  create(args: { data: any; [key: string]: any }) {
    return this.prismaModel.create(args);
  }

  /**
   * Create multiple records at once
   */
  batchCreate(data: any[]) {
    return this.prismaModel.createMany({ data });
  }

  /**
   * Find all records matching options
   */
  findAll(args?: any) {
    return this.prismaModel.findMany(args || {});
  }

  /**
   * Find a record by its ID
   */
  findById(id: number | string, args?: Omit<any, "where">) {
    const findOptions = {
      where: { id },
      ...args,
    };
    return this.prismaModel.findUnique(findOptions);
  }

  /**
   * Update a record by its ID
   */
  update(id: number | string, data: any, args?: Omit<any, "where" | "data">) {
    const updateOptions = {
      where: { id },
      data,
      ...args,
    };
    return this.prismaModel.update(updateOptions);
  }

  /**
   * Delete a record by its ID
   */
  delete(id: number | string, args?: Omit<any, "where">) {
    const deleteOptions = {
      where: { id },
      ...args,
    };
    return this.prismaModel.delete(deleteOptions);
  }

  /**
   * Find many records with a where condition
   */
  findMany(where: any, args?: Omit<any, "where">) {
    const options = {
      where,
      ...args,
    };
    return this.prismaModel.findMany(options);
  }

  /**
   * Find the first record matching the where condition
   */
  findFirst(where: any, args?: Omit<any, "where">) {
    const options = {
      where,
      ...args,
    };
    return this.prismaModel.findFirst(options);
  }

  /**
   * Count records matching the where condition
   */
  count(where: any, args?: Omit<any, "where">) {
    const options = {
      where,
      ...args,
    };
    return this.prismaModel.count(options);
  }

  findUnique(where: any, args?: Omit<any, "where">) {
    const options = {
      where,
      ...args,
    };
    return this.prismaModel.findUnique(options);
  }
}
