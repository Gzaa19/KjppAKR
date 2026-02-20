import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is not defined");
    }

    const isInternalRailway = connectionString.includes("railway.internal");

    const pool =
        globalForPrisma.pool ??
        new Pool({
            connectionString,
            ssl: isInternalRailway ? false : { rejectUnauthorized: false },
        });
    globalForPrisma.pool = pool;

    const adapter = new PrismaPg(pool);

    return new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });
}

export const getPrisma = (): PrismaClient => {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
    }
    return globalForPrisma.prisma;
};

const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop) {
        const client = getPrisma();
        const value = (client as unknown as Record<string | symbol, unknown>)[prop];
        if (typeof value === "function") {
            return value.bind(client);
        }
        return value;
    },
});

export { prisma };
export default prisma;