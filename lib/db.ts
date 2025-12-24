import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const getPrisma = () => {
    if (!_prismaInstance) {
        _prismaInstance = globalForPrisma.prisma || new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        })
        if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _prismaInstance
    }
    return _prismaInstance
}

let _prismaInstance: PrismaClient

// Export a proxy as 'db' and 'prisma' to maintain compatibility while being lazy
export const db = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
        // If it's a known prisma property or model, initialize
        const client = getPrisma()
        return (client as any)[prop]
    }
})

export const prisma = db
