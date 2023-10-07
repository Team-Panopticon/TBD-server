import { IsDateString, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Meal, Slot } from '../types';

export class CreateVotingDto {
  @IsString()
  @MinLength(1)
  username: string;

  @IsOptional()
  dateType?: Slot[];

  @IsOptional()
  mealType?: Slot[];
}

export class VotingSlotDto implements Slot {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  @Matches(/^lunch|dinner$/)
  meal?: Meal;
}
