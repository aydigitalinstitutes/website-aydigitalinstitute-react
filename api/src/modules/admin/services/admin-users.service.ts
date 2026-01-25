import { Injectable } from '@nestjs/common';
import { AdminUsersRepository } from '../repositories/admin-users.repository';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(private readonly repo: AdminUsersRepository) {}

  async list(params: {
    page: number;
    limit: number;
    search?: string;
    role?: 'USER' | 'ADMIN';
    isActive?: boolean;
  }) {
    return { success: true, ...(await this.repo.list(params)) };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.repo.update(id, dto);
    return { success: true, user };
  }
}

