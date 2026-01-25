import { AdminUsersRepository } from './admin-users.repository';

describe('AdminUsersRepository', () => {
  const prisma = {
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  const repo = new AdminUsersRepository(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists with pagination', async () => {
    prisma.$transaction.mockResolvedValueOnce([5, [{ id: 'u1' }]]);

    const result = await repo.list({ page: 2, limit: 10 });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(5);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('updates user', async () => {
    prisma.user.update.mockResolvedValueOnce({ id: 'u1', role: 'ADMIN' });
    const user = await repo.update('u1', { role: 'ADMIN' });
    expect(user).toEqual({ id: 'u1', role: 'ADMIN' });
  });
});
