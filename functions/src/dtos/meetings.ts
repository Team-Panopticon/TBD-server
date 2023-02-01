import { IsString, IsDateString, IsOptional, Matches, Length, MinLength, ArrayNotEmpty } from 'class-validator';
import { ISODateTime } from '../types';

export class CreateMeetingDto {
  @IsString()
  @MinLength(1)
  name: string;

  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  dates: ISODateTime[];

  @IsString()
  @Matches(/^(date|meal)$/)
  type: "date" | "meal";

  @IsDateString()
  deadline: ISODateTime;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  @Matches(/^[0-9]+$/)
  password?: string; // sha256 hashed value in database
}
