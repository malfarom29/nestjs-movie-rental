import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { EmailModule } from 'src/email/email.module';
import { MovieLogRepository } from './movie-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieRepository, MovieLogRepository]),
    EmailModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
