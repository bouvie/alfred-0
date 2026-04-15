import { Module } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { PipelineResolver } from './pipeline.resolver';

@Module({
  providers: [PipelineService, PipelineResolver],
})
export class PipelineModule {}
