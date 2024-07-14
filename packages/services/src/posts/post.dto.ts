import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreatePostDto {
  title: string;
  content?: string;
  authorId: number;
}

export class UpdatePostDto {
  id: number;
  title?: string;
  content?: string;
}

export class GetPostsDto {
  page?: number;
  limit?: number;
  search?: string;
  provider?: string;
}
