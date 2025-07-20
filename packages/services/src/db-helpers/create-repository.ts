import { PrismaClient, Prisma } from "@repo/db";

type PrismaModelDelegate = PrismaClient[Extract<keyof PrismaClient, string>];

type DelegateMethod<T> = T extends (...args: any[]) => any ? T : never;
type ArgsOf<T extends (...args: any[]) => any> = Parameters<T>[0];
type ReturnOf<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>;

export function createRepository<
  Delegate extends Record<string, any>,
  ArgsType,
  PayloadType,
>(delegate: Delegate) {
  return {
    findUnique: <T extends ArgsType>(
      args: Prisma.SelectSubset<
        T,
        ArgsOf<DelegateMethod<Delegate["findUnique"]>>
      >,
    ): Promise<PayloadType | null> => {
      return delegate.findUnique(args);
    },

    findFirst: <T extends ArgsType>(
      args: Prisma.SelectSubset<
        T,
        ArgsOf<DelegateMethod<Delegate["findFirst"]>>
      >,
    ): Promise<PayloadType | null> => {
      return delegate.findFirst(args);
    },

    findMany: <T extends ArgsType>(
      args?: Prisma.SelectSubset<
        T,
        ArgsOf<DelegateMethod<Delegate["findMany"]>>
      >,
    ): Promise<PayloadType[]> => {
      return delegate.findMany(args || {});
    },

    create: <T extends ArgsType>(
      args: Prisma.SelectSubset<T, ArgsOf<DelegateMethod<Delegate["create"]>>>,
    ): Promise<PayloadType> => {
      return delegate.create(args);
    },

    update: <T extends ArgsType>(
      args: Prisma.SelectSubset<T, ArgsOf<DelegateMethod<Delegate["update"]>>>,
    ): Promise<PayloadType> => {
      return delegate.update(args);
    },

    delete: <T extends ArgsType>(
      args: Prisma.SelectSubset<T, ArgsOf<DelegateMethod<Delegate["delete"]>>>,
    ): Promise<PayloadType> => {
      return delegate.delete(args);
    },
  };
}
