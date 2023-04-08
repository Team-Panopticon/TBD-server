import { IsOptional, IsString, MinLength } from "class-validator";
import { Vote } from "../types";

export class CreateVotingDto {
  @IsString()
  @MinLength(1)
  userName: string;

  @IsOptional()
  date?: Vote[];

  @IsOptional()
  meal?: Vote[];
}
