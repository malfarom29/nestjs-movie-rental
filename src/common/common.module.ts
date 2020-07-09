import { MovieSerializer } from './../shared/serializers/movie-serializer';
import { MovieImageMapper } from './../shared/mappers/movie-image.mapper';
import { VoteRepository } from './../repositories/votes.repository';
import { MovieAttachmentRepository } from './../repositories/movie-attachment.repository';
import { MovieRepository } from './../repositories/movie.repository';
import { AuthModule } from './../auth/auth.module';
import { PaginatedSerializer } from './../shared/serializers/paginated-serializer';
import { UserSerializer } from './../shared/serializers/user-serializer';
import { UserRepository } from './../repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { MoviesController } from './controllers/movies/movies.controller';
import { MoviesService } from 'src/services/movies.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserRepository,
      MovieRepository,
      MovieAttachmentRepository,
      VoteRepository,
    ]),
  ],
  controllers: [UsersController, MoviesController],
  providers: [
    UserService,
    MoviesService,
    PaginatedSerializer,
    UserSerializer,
    MovieSerializer,
    MovieImageMapper,
  ],
})
export class CommonModule {}
