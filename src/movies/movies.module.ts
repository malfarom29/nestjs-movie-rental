import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MovieSerializer } from 'src/shared/serializers/movie-serializer';
import { MoviesService } from 'src/movies/services/movies.service';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';
import { MovieImageMapper } from 'src/shared/mappers/movie-image.mapper';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from 'src/movies/repositories/movie.repository';
import { MovieAttachmentRepository } from 'src/movies/repositories/movie-attachment.repository';
import { VoteRepository } from 'src/movies/repositories/votes.repository';

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
