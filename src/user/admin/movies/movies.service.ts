import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { Movie } from 'src/movies/entities/movie.entity';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from 'src/movies/repositories/movie.repository';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
  ) {}

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ id });

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found`);
    }

    return movie;
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieRepository.createMovie(createMovieDto);
  }

  async updateMove(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(await this.getMovieById(id));
    await this.movieRepository.update(movie, updateMovieDto);
    await movie.reload();

    return movie;
  }

  async updateMovieAvailability(id: number): Promise<Movie> {
    const movie = await this.getMovieById(id);
    movie.availability = !movie.availability;
    movie.save();

    return movie;
  }

  async deleteMovie(id: number): Promise<void> {
    const result = await this.movieRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
