// lib/db.ts - Lazy Prisma Client with Dynamic Import
// This prevents Prisma from being loaded during Next.js static analysis

let _prismaInstance: any = null;
let _prismaPromise: Promise<any> | null = null;

async function initPrisma() {
    if (_prismaInstance) return _prismaInstance;

    if (!_prismaPromise) {
        _prismaPromise = import('@prisma/client').then(({ PrismaClient }) => {
            const globalForPrisma = global as unknown as { prisma: any };

            _prismaInstance = globalForPrisma.prisma || new PrismaClient({
                log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            });

            if (process.env.NODE_ENV !== 'production') {
                globalForPrisma.prisma = _prismaInstance;
            }

            return _prismaInstance;
        });
    }

    return _prismaPromise;
}

// Create a proxy that initializes Prisma on first access
function createLazyProxy() {
    return new Proxy({} as any, {
        get: (target, prop) => {
            // Return a function that will initialize and call the method
            if (typeof prop === 'string') {
                // For model properties (user, account, etc.), return a proxy for the model
                return new Proxy({} as any, {
                    get: (modelTarget, modelProp) => {
                        return async (...args: any[]) => {
                            const client = await initPrisma();
                            const model = (client as any)[prop];
                            if (model && typeof model[modelProp] === 'function') {
                                return model[modelProp](...args);
                            }
                            return model?.[modelProp];
                        };
                    }
                });
            }
            return undefined;
        }
    });
}

export const db = createLazyProxy();
export const prisma = db;

// Export a getter for direct access when needed
export async function getDb() {
    return initPrisma();
}
