import { EntityRepository, Repository } from 'typeorm';
import { Vote } from 'src/database/entities/vote.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  async createVote(userId: number, movieId: number): Promise<void> {
    const vote = new Vote();
    vote.movieId = movieId;
    vote.userId = userId;

    try {
      await vote.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
