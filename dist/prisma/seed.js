import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const userRole = await prisma.role.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: "User",
        },
    });
    const adminRole = await prisma.role.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            name: "Admin",
        },
    });
    const staffRole = await prisma.role.upsert({
        where: { id: 3 },
        update: {},
        create: {
            id: 3,
            name: "Staff",
        },
    });
    const email = "johnstonsam712@gmail.com";
    const sam = await prisma.user.upsert({
        where: { email: email },
        update: {},
        create: {
            email: email,
            firstname: "Sam",
            lastname: "Johnston",
            age: 22,
            role: {
                connect: {
                    id: 2,
                },
            },
        },
    });
    const melissa = await prisma.user.upsert({
        where: { email: "melistammers@hotmail.com" },
        update: {},
        create: {
            email: "melistammers@hotmail.com",
            firstname: "Melissa",
            lastname: "Stammers",
            age: 23,
            role: {
                connect: {
                    id: 1,
                },
            },
        },
    });
    console.log({
        users: [sam, melissa],
        roles: [userRole, adminRole, staffRole],
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
