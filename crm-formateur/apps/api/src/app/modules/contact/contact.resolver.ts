import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { ContactStatus } from '@prisma/client';

@Resolver('Contact')
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Query('contacts')
  contacts(
    @Args('status') status?: ContactStatus,
    @Args('search') search?: string,
  ) {
    return this.contactService.findAll(status, search);
  }

  @Query('contact')
  contact(@Args('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Mutation('createContact')
  createContact(@Args('input') input: {
    name: string;
    company?: string;
    status?: ContactStatus;
    tags?: string[];
    notes?: string;
    assigneeId?: string;
  }) {
    const { assigneeId, ...rest } = input;
    return this.contactService.create({
      ...rest,
      tags: rest.tags ?? [],
      assignee: assigneeId ? { connect: { id: assigneeId } } : undefined,
    });
  }

  @Mutation('updateContact')
  updateContact(
    @Args('id') id: string,
    @Args('input') input: Record<string, unknown>,
  ) {
    return this.contactService.update(id, input);
  }

  @Mutation('deleteContact')
  deleteContact(@Args('id') id: string) {
    return this.contactService.delete(id);
  }
}
