import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreateCommentDTO } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  // Créer un commentaire
  createComment(comment: CreateCommentDTO): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  // Récupérer les commentaires d'un post
  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }

  // Récupérer les commentaires d'un utilisateur
  getCommentsByUser(userId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Compter les commentaires d'un post
  countCommentsByPost(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/post/${postId}/count`);
  }

  // Supprimer un commentaire
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}