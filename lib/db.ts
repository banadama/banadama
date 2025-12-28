// lib/db.ts - Prisma Client with Raw Query Support

import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

function getPrismaInstance(): PrismaClient {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });

        // Prevent multiple instances in development
        if (process.env.NODE_ENV !== 'production') {
            const globalForPrisma = global as unknown as { prisma: PrismaClient };
            globalForPrisma.prisma = prismaInstance;
        }
    }

    return prismaInstance;
}

// Create a wrapper that adds the query method
const dbClient = getPrismaInstance() as any;

// Add query method for backward compatibility with raw SQL queries
dbClient.query = async function(sql: string, params: any[] = []) {
    // Convert numbered parameters ($1, $2, etc.) to Prisma format
    let query = sql;
    const values = [];
    
    for (const param of params) {
        values.push(param);
    }
    
    // Use $queryRawUnsafe for backward compatibility
    return this.$queryRawUnsafe(query, ...values);
};

export const db = dbClient;
export const prisma = dbClient;
