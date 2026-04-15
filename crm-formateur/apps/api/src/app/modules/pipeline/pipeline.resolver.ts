import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PipelineService } from './pipeline.service';

@Resolver('Pipeline')
export class PipelineResolver {
  constructor(private readonly pipelineService: PipelineService) {}

  @Query('pipeline')
  pipeline() {
    return this.pipelineService.getPipeline();
  }

  @Mutation('moveContact')
  moveContact(
    @Args('input') input: { contactId: string; columnId: string; position: number },
  ) {
    return this.pipelineService.moveContact(input.contactId, input.columnId, input.position);
  }
}
