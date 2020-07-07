import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieAttachmentRepository } from '../repositories/movie-attachment.repository';
import { MovieRepository } from '../repositories/movie.repository';
import { PassportModule } from '@nestjs/passport';
import { MovieImageMapper } from 'src/shared/mappers/movie-image.mapper';
import { VoteRepository } from 'src/repositories/votes.repository';
import { MovieSerializer } from 'src/shared/serializers/movie-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovieRepository,
      MovieAttachmentRepository,
      VoteRepository,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MovieImageMapper,
    PaginatedSerializer,
    MovieSerializer,
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
