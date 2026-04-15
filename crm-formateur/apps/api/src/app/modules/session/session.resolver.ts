import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { SessionStatus } from '@prisma/client';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query('sessions')
  sessions(@Args('status') status?: SessionStatus) {
    return this.sessionService.findAll(status);
  }

  @Query('session')
  session(@Args('id') id: string) {
    return this.sessionService.findOne(id);
  }

  @Mutation('createSession')
  createSession(@Args('input') input: {
    title: string;
    contactId: string;
    date: string;
    duration: number;
    status?: SessionStatus;
    notes?: string;
    collaboratorId?: string;
  }) {
    const { contactId, collaboratorId, ...rest } = input;
    return this.sessionService.create({
      ...rest,
      date: new Date(input.date),
      contact: { connect: { id: contactId } },
      collaborator: collaboratorId ? { connect: { id: collaboratorId } } : undefined,
    });
  }

  @Mutation('updateSession')
  updateSession(
    @Args('id') id: string,
    @Args('input') input: Record<string, unknown>,
  ) {
    const data = { ...input };
    if (data['date']) data['date'] = new Date(data['date'] as string);
    return this.sessionService.update(id, data);
  }

  @Mutation('deleteSession')
  deleteSession(@Args('id') id: string) {
    return this.sessionService.delete(id);
  }
}
