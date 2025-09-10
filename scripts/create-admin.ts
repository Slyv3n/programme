import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const username = 'admin';
    const plainPassword = 'password';

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await prisma.adminUser.deleteMany({
        where: { username: username },
    });

    const user = await prisma.adminUser.create({
        data: {
            username: username,
            password: hashedPassword,
        },
    });

    console.log(`Utilisateur '${user.username}' créé avec succès.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });