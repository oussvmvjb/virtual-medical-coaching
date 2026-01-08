export interface Comment {
  id?: number;
  postId: number;
  userId: number;
  content: string;
  createdAt?: string;
}

export interface CreateCommentDTO {
  postId: number;
  userId: number;
  content: string;
}