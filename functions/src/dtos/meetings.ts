import {
  IsString,
  IsDateString,
  IsOptional,
  Matches,
  Length,
  ArrayNotEmpty,
} from 'class-validator';
import { ISODateTime, MeetingType } from '../types';
import { Expose } from 'class-transformer';

export class UpdateMeetingDto {
  @IsString()
  @Length(1, 100)
  @Expose()
  name: string;

  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @Expose()
  dates: ISODateTime[];

  @IsString()
  @Matches(/^dateType|mealType$/)
  @Expose()
  type: MeetingType;
}

export class CreateMeetingDto extends UpdateMeetingDto  {
  @IsOptional()
  @IsString()
  @Length(4, 4)
  @Matches(/^[0-9]+$/)
  // plain string in DTO
  // sha256 hash is stored in database
  password?: string;
}
