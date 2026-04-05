import { PrismaClient, UserRole, RecordType } from "@prisma/client";
import bcrypt from "bcrypt";
import logger from "../common/utils/logger";
import { env } from "../config/env";

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash("Password@123", parseInt(env.BCRYPT_SALT_ROUNDS));

    const admin = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@test.com",
            passwordHash,
            role: "ADMIN",
        },
    });

    const analyst = await prisma.user.upsert({
        where: { email: "analyst@test.com" },
        update: {},
        create: {
            name: "Analyst User",
            email: "analyst@test.com",
            passwordHash,
            role: UserRole.ANALYST,
        },
    });

    const viewer = await prisma.user.upsert({
        where: { email: "viewer@test.com" },
        update: {},
        create: {
            name: "Viewer User",
            email: "viewer@test.com",
            passwordHash,
            role: UserRole.VIEWER,
        },
    });

    const salary = await prisma.category.upsert({
        where: { name: "Salary" },
        update: {},
        create: {
            name: "Salary",
            isSystem: true,
            createdBy: admin.id,
        },
    });

    const rent = await prisma.category.upsert({
        where: { name: "Housing" },
        update: {},
        create: {
            name: "Housing",
            isSystem: true,
            createdBy: admin.id,
        },
    });


    await prisma.financialRecord.createMany({
        data: [
            {
                userId: viewer.id,
                categoryId: salary.id,
                amount: 75000,
                type: RecordType.INCOME,
                date: new Date(),
            },
            {
                userId: viewer.id,
                categoryId: rent.id,
                amount: 15000,
                type: RecordType.EXPENSE,
                date: new Date(),
            },
            {
                userId: analyst.id,
                categoryId: salary.id,
                amount: 70000,
                type: RecordType.INCOME,
                date: new Date(),
            },
        ],
    });

    console.log("🌱 Seed data inserted");
}

main()
    .catch((e) => {
        logger.error("Error seeding data:", e);
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());