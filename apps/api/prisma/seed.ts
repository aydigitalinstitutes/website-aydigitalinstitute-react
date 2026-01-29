import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  const users = [
    { email: 'superadmin@aydigital.com', name: 'Super Admin', role: 'SUPER_ADMIN' },
    { email: 'admin@aydigital.com', name: 'Admin User', role: 'ADMIN' },
    { email: 'teacher@aydigital.com', name: 'Teacher User', role: 'TEACHER' },
    { email: 'instructor@aydigital.com', name: 'Instructor User', role: 'INSTRUCTOR' },
    { email: 'hod@aydigital.com', name: 'Head of Dept', role: 'HOD' },
    { email: 'dean@aydigital.com', name: 'Dean User', role: 'DEAN' },
    { email: 'user@aydigital.com', name: 'Standard User', role: 'USER' },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          role: user.role as any,
          provider: 'LOCAL',
          passwordHash: user.role.includes('ADMIN') ? adminPasswordHash : passwordHash,
        },
      });
      console.log(`Created ${user.role}: ${user.email}`);
    } else {
      console.log(`${user.role} already exists: ${user.email}`);
    }
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

