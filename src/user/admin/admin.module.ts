import { Module } from '@nestjs/common';
import { MoviesController } from './movies/movies.controller';
import { MoviesService } from './movies/movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from 'src/repositories/movie.repository';
import { PassportModule } from '@nestjs/passport';
import { MovieAttachmentRepository } from 'src/repositories/movie-attachment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieRepository, MovieAttachmentRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class AdminModule {}
