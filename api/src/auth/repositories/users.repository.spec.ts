import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  const repo = new UsersRepository(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('finds by email', async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: 'u1' });
    await expect(repo.findByEmail('a@b.com')).resolves.toEqual({ id: 'u1' });
  });

  it('creates local user', async () => {
    prisma.user.create.mockResolvedValueOnce({ id: 'u1' });
    await expect(
      repo.createLocal({ email: 'a@b.com', name: 'A', passwordHash: 'x' }),
    ).resolves.toEqual({ id: 'u1' });
  });

  it('upserts oauth by updating existing user', async () => {
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        user: {
          findUnique: jest
            .fn()
            .mockResolvedValue({ id: 'u1', name: 'Existing' }),
          update: jest.fn().mockResolvedValue({ id: 'u1', provider: 'GOOGLE' }),
          create: jest.fn(),
        },
      }),
    );

    const result = await repo.upsertOAuth({
      provider: 'GOOGLE',
      providerId: 'p1',
      email: 'a@b.com',
      name: 'New',
      avatarUrl: 'x',
    });

    expect(result).toEqual({ id: 'u1', provider: 'GOOGLE' });
  });

  it('upserts oauth by creating new user', async () => {
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          update: jest.fn(),
          create: jest.fn().mockResolvedValue({ id: 'u2', provider: 'GITHUB' }),
        },
      }),
    );

    const result = await repo.upsertOAuth({
      provider: 'GITHUB',
      providerId: 'p2',
      email: 'c@d.com',
      name: 'C',
    });

    expect(result).toEqual({ id: 'u2', provider: 'GITHUB' });
  });
});
