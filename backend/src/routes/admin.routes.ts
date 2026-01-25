import express from 'express';
import { prisma } from '../prisma.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  const [totalUsers, activeUsers, adminUsers, studentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      adminUsers,
      studentUsers,
    },
  });
});

router.get('/users', async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 25)));
  const search = String(req.query.search ?? '').trim();
  const role = String(req.query.role ?? '').trim();
  const isActiveRaw = String(req.query.isActive ?? '').trim();
  const isActive = isActiveRaw === '' ? undefined : isActiveRaw === 'true';

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(role ? { role: role as any } : {}),
    ...(typeof isActive === 'boolean' ? { isActive } : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        courseInterested: true,
        isEmailVerified: true,
        emailVerifiedAt: true,
        isActive: true,
        provider: true,
        providerId: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  res.json({
    success: true,
    page,
    limit,
    total,
    users,
  });
});

router.patch('/users/:id', async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isFinite(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user id',
    });
  }

  const { isActive, role } = req.body ?? {};

  if (typeof isActive !== 'boolean' && typeof role !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Provide at least one of: isActive, role',
    });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(typeof isActive === 'boolean' ? { isActive } : {}),
      ...(typeof role === 'string' ? { role: role as any } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    user: updated,
  });
});

export default router;

