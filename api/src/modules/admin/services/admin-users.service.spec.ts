import { AdminUsersService } from './admin-users.service';

describe('AdminUsersService', () => {
  const repo = {
    list: jest.fn(),
    update: jest.fn(),
  } as any;

  const service = new AdminUsersService(repo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps list result', async () => {
    repo.list.mockResolvedValueOnce({ total: 1, page: 1, limit: 25, data: [{ id: 'u1' }] });
    const res = await service.list({ page: 1, limit: 25 });
    expect(res.success).toBe(true);
    expect(res.total).toBe(1);
  });

  it('wraps update result', async () => {
    repo.update.mockResolvedValueOnce({ id: 'u1', isActive: false });
    const res = await service.update('u1', { isActive: false });
    expect(res.success).toBe(true);
    expect(res.user.id).toBe('u1');
  });
});

