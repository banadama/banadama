import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaBase =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaBase;

// Extend prisma with .query helper for compatibility with requested snippets
export const db = Object.assign(prismaBase, {
    query: async (sql: string, params: any[] = []) => {
        // Simple parameter replacement since $queryRawUnsafe doesn't take params array in the same way as some drivers
        // Wait, $queryRawUnsafe DOES take parameters as additional arguments
        return (prismaBase as any).$queryRawUnsafe(sql, ...params);
    }
});

export const prisma = db;
