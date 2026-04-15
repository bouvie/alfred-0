import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';
import { ContactStatus, Prisma } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: ContactStatus, search?: string) {
    const where: Prisma.ContactWhereInput = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.contact.findMany({
      where,
      include: { assignee: { select: { id: true, name: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
      include: { assignee: { select: { id: true, name: true } } },
    });
  }

  create(input: Prisma.ContactCreateInput) {
    return this.prisma.contact.create({
      data: input,
      include: { assignee: { select: { id: true, name: true } } },
    });
  }

  update(id: string, input: Prisma.ContactUpdateInput) {
    return this.prisma.contact.update({
      where: { id },
      data: { ...input, updatedAt: new Date() },
      include: { assignee: { select: { id: true, name: true } } },
    });
  }

  delete(id: string) {
    return this.prisma.contact.delete({ where: { id } }).then(() => true);
  }

  updateStatus(id: string, status: ContactStatus) {
    return this.prisma.contact.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: { assignee: { select: { id: true, name: true } } },
    });
  }
}
