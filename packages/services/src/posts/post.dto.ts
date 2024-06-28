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
