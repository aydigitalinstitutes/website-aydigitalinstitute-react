import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
  const email = 'admin@aydigital.com';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email,
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        isEmailVerified: true,
        isActive: true,
      },
    });
  }
};

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

