import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';
import { SessionStatus, Prisma } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: SessionStatus) {
    return this.prisma.session.findMany({
      where: status ? { status } : undefined,
      include: {
        contact: { select: { id: true, name: true, company: true } },
        collaborator: { select: { id: true, name: true } },
      },
      orderBy: { date: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
      include: {
        contact: { select: { id: true, name: true, company: true } },
        collaborator: { select: { id: true, name: true } },
      },
    });
  }

  create(input: Prisma.SessionCreateInput) {
    return this.prisma.session.create({
      data: input,
      include: {
        contact: { select: { id: true, name: true, company: true } },
      },
    });
  }

  update(id: string, input: Prisma.SessionUpdateInput) {
    return this.prisma.session.update({
      where: { id },
      data: { ...input, updatedAt: new Date() },
      include: {
        contact: { select: { id: true, name: true, company: true } },
      },
    });
  }

  delete(id: string) {
    return this.prisma.session.delete({ where: { id } }).then(() => true);
  }
}
