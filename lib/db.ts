import { PrismaClient } from '@prisma/client';

declare global {
  // Évite les conflits de typage pour `globalThis.prisma`
  const prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// En développement, conserve l'instance dans `globalThis` pour éviter des multiples instanciations.
if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma;
}

export default prisma;
