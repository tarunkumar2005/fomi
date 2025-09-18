import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = (() => {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma should not be initialized in the browser');
  }
  
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query'],
    });
  }
  
  return global.prisma;
})();

export { prisma };