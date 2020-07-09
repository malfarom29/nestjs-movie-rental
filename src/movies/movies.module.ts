import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MovieSerializer } from 'src/shared/serializers/movie-serializer';
import { MoviesService } from 'src/services/movies.service';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';
import { MovieImageMapper } from 'src/shared/mappers/movie-image.mapper';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from 'src/repositories/movie.repository';
import { MovieAttachmentRepository } from 'src/repositories/movie-attachment.repository';
import { VoteRepository } from 'src/repositories/votes.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      MovieRepository,
      MovieAttachmentRepository,
      VoteRepository,
    ]),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MovieSerializer,
    PaginatedSerializer,
    MovieImageMapper,
  ],
})
export class MoviesModule {}
