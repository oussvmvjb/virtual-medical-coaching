export interface Post {
  id?: number;
  userId: number;
  title: string;
  content: string;
  upvotes: number;
  createdAt?: string;
}

export interface CreatePostDTO {
  userId: number;
  title: string;
  content: string;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
}