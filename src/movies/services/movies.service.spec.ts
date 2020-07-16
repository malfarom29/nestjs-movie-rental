import { PurchaseOrder } from './../../customer/controllers/orders/entities/purchase-order.entity';
import { Role } from './../../users/entities/role.entity';
import { RentalOrder } from './../../customer/controllers/orders/entities/rental-order.entity';
import { User } from './../../users/entities/user.entity';
import { MovieLog } from './../entities/movie-log.entity';
import { Vote } from './../entities/vote.entity';
import { MovieAttachment } from './../entities/movie-attachment.entity';
import { PaginatedSerializer } from './../../shared/serializers/paginated-serializer';
import { MovieSerializer } from './../../shared/serializers/movie-serializer';
import { Test } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieAttachmentRepository } from '../repositories/movie-attachment.repository';
import { VoteRepository } from '../repositories/votes.repository';
import { MovieImageMapper } from '../../shared/mappers/movie-image.mapper';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity';
import { Repository } from 'typeorm';
import { testDbConnection } from '../../utils/testing-helpers/test-db-connection';
import { Auth } from '../../auth/entities/auth.entity';

describe('MoviesService', () => {
  let moviesService;
  let movieRepository: Repository<Movie>;
  let movieAttachmentRepository: Repository<MovieAttachment>;
  let voteRepository: Repository<Vote>;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(
          testDbConnection([
            Movie,
            MovieLog,
            MovieAttachment,
            Vote,
            User,
            Auth,
            RentalOrder,
            PurchaseOrder,
            Role,
          ]),
        ),
        TypeOrmModule.forFeature([
          MovieRepository,
          MovieAttachmentRepository,
          VoteRepository,
        ]),
      ],
      providers: [
        MoviesService,
        MovieImageMapper,
        MovieSerializer,
        PaginatedSerializer,
      ],
    }).compile();

    app = module.createNestApplication();

    moviesService = await module.get(MoviesService);
    movieRepository = await module.get(MovieRepository);
    movieAttachmentRepository = await module.get(MovieAttachmentRepository);
    voteRepository = await module.get(VoteRepository);

    await app.init();
  });

  afterEach(async () => {
    await movieRepository.query('DELETE FROM movie;');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getMovies', () => {
    it('should call getMovies from MovieRepository', async () => {
      const result = await moviesService.getMovies({}, {});
      expect(result).toEqual({
        data: [],
        totalCount: 0,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('createMovie', () => {
    it('should create a movie', async () => {
      const mockedMovie = {
        title: 'example',
        description: 'example',
        stock: 1,
        salePrice: 1,
        rentalPrice: 1,
        dailyPenalty: 0.25,
        availability: true,
        imageId: null,
        onRent: 0,
      };

      const result = await moviesService.createMovie(mockedMovie);
      const { id } = await movieRepository.findOne({ title: 'example' });

      expect(result).toEqual({ id, ...mockedMovie });
    });
  });
});
