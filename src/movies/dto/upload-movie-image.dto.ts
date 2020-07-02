import { IsString, IsNotEmpty } from 'class-validator';

export class UploadMovieImageDto {
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;
}
