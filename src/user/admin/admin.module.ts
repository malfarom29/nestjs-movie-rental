import { Module } from '@nestjs/common';
import { MoviesController } from './movies/movies.controller';
import { MoviesService } from './movies/movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from 'src/movies/repositories/movie.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class AdminModule {}
