import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MovieRepository])],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
