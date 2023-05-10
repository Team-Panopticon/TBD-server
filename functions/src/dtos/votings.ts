import { IsOptional, IsString, MinLength } from "class-validator";
import { Slot } from "../types";

export class CreateVotingDto {
  @IsString()
  @MinLength(1)
  userName: string;

  @IsOptional()
  dateType?: Slot[];

  @IsOptional()
  mealType?: Slot[];
}
