import { IsOptional, IsString, MinLength } from "class-validator";
import { Vote } from "../types";

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  date?: Vote[];

  @IsOptional()
  meal?: Vote[];
}
