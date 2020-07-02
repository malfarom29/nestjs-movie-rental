import { EntityRepository, Repository } from 'typeorm';
import { MovieAttachment } from '../../database/entities/movie-attachment.entity';
import { UploadData } from '../upload-data.interface';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(MovieAttachment)
export class MovieAttachmentRepository extends Repository<MovieAttachment> {
  private readonly logger = new Logger();
  async saveSignedUrl(awsData: UploadData): Promise<MovieAttachment> {
    const attachment = new MovieAttachment();
    const { fileType, mimeType, key } = awsData;
    attachment.path = 'upload/movies/';
    attachment.fileType = fileType;
    attachment.mimeType = mimeType;
    attachment.key = key;

    try {
      await attachment.save();
    } catch (error) {
      this.logger.error(error.stack);
      throw new InternalServerErrorException();
    }

    return attachment;
  }
}
