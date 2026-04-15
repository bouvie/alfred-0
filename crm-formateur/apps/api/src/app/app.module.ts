import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DatabaseModule } from '@org/database';
import { ContactModule } from './modules/contact/contact.module';
import { SessionModule } from './modules/session/session.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [join(process.cwd(), 'libs/shared/src/lib/graphql/*.graphql')],
      playground: true,
      context: ({ request, reply }: { request: unknown; reply: unknown }) => ({ request, reply }),
    }),
    DatabaseModule,
    ContactModule,
    SessionModule,
    PipelineModule,
  ],
})
export class AppModule {}
