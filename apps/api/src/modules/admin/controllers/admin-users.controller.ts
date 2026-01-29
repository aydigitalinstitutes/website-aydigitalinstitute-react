import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { AdminUsersService } from '../services/admin-users.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminUsersController {
  constructor(private readonly service: AdminUsersService) {}

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: 'USER' | 'ADMIN',
    @Query('isActive') isActive?: string,
  ) {
    const pageNum = Math.max(1, Number(page ?? 1));
    const limitNum = Math.min(100, Math.max(1, Number(limit ?? 25)));
    const isActiveBool =
      isActive === undefined ? undefined : isActive === 'true';
    return this.service.list({
      page: pageNum,
      limit: limitNum,
      search,
      role,
      isActive: isActiveBool,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }
}
