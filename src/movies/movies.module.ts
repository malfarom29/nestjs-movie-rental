import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieAttachmentRepository } from './repositories/movie-attachment.repository';
import { MovieRepository } from './repositories/movie.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieRepository, MovieAttachmentRepository]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
