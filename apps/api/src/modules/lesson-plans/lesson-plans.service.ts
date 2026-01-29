import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';

@Injectable()
export class LessonPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createLessonPlanDto: CreateLessonPlanDto) {
    return this.prisma.lessonPlan.create({
      data: {
        ...createLessonPlanDto,
        authorId: userId,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: any;
    where?: any;
    orderBy?: any;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.lessonPlan.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const lessonPlan = await this.prisma.lessonPlan.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!lessonPlan) {
      throw new NotFoundException(`Lesson Plan with ID ${id} not found`);
    }

    return lessonPlan;
  }

  async update(id: string, updateLessonPlanDto: UpdateLessonPlanDto) {
    // Check if exists
    await this.findOne(id);

    return this.prisma.lessonPlan.update({
      where: { id },
      data: updateLessonPlanDto,
    });
  }

  async remove(id: string) {
    // Check if exists
    await this.findOne(id);

    return this.prisma.lessonPlan.delete({
      where: { id },
    });
  }
}
