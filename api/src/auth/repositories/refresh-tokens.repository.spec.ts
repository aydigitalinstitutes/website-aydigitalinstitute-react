import { RefreshTokensRepository } from './refresh-tokens.repository';

describe('RefreshTokensRepository', () => {
  const redis = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  } as any;

  const repo = new RefreshTokensRepository(redis);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores token with TTL', async () => {
    await repo.store('u1', 't1', 60);
    expect(redis.set).toHaveBeenCalledWith('refresh:u1:t1', '1', 60);
  });

  it('returns exists true only when value is 1', async () => {
    redis.get.mockResolvedValueOnce('1');
    await expect(repo.exists('u1', 't1')).resolves.toBe(true);

    redis.get.mockResolvedValueOnce(null);
    await expect(repo.exists('u1', 't1')).resolves.toBe(false);
  });

  it('revokes token', async () => {
    await repo.revoke('u1', 't1');
    expect(redis.del).toHaveBeenCalledWith('refresh:u1:t1');
  });
});

