import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, CreatePostDTO } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  // Créer un post
  createPost(post: CreatePostDTO): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  // Récupérer tous les posts
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // Récupérer un post par ID
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // Upvoter un post
  upvotePost(id: number): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}/upvote`, {});
  }

  // Supprimer un post
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les posts d'un utilisateur
  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}`);
  }
}