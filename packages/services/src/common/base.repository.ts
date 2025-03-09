export interface IBaseRepository<
  T,
  ID,
  CreateDTO = Partial<T>,
  UpdateDTO = Partial<T>,
> {
  create(data: CreateDTO): Promise<T>;
  findAll(options?: any): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  update(id: ID, data: UpdateDTO): Promise<T>;
  delete(id: ID): Promise<void>;
}

export class BaseRepository<
  T,
  ID,
  CreateDTO = Partial<T>,
  UpdateDTO = Partial<T>,
> implements IBaseRepository<T, ID, CreateDTO, UpdateDTO>
{
  constructor(
    protected prisma: any,
    protected model: string
  ) {}

  async create(data: CreateDTO): Promise<T> {
    return this.prisma[this.model].create({ data });
  }

  async findAll(options?: any): Promise<T[]> {
    return this.prisma[this.model].findMany(options);
  }

  async findById(id: ID): Promise<T | null> {
    return this.prisma[this.model].findUnique({ where: { id } });
  }

  async update(id: ID, data: UpdateDTO): Promise<T> {
    return this.prisma[this.model].update({ where: { id }, data });
  }

  async delete(id: ID): Promise<void> {
    await this.prisma[this.model].delete({ where: { id } });
  }

  // Common helper methods
  protected findMany(where: any, include?: any): Promise<T[]> {
    const options: any = { where };
    if (include) options.include = include;
    return this.prisma[this.model].findMany(options);
  }

  protected findUnique(where: any, include?: any): Promise<T | null> {
    const options: any = { where };
    if (include) options.include = include;
    return this.prisma[this.model].findUnique(options);
  }

  protected findFirst(where: any, include?: any): Promise<T | null> {
    const options: any = { where };
    if (include) options.include = include;
    return this.prisma[this.model].findFirst(options);
  }
}
