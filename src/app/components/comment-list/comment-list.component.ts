import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { Comment, CreateCommentDTO } from '../../models/comment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit, OnChanges {
  @Input() postId!: number;
  
  comments: Comment[] = [];
  loading = false;
  errorMessage = '';
  
  newComment: CreateCommentDTO = {
    postId: 0,
    userId: 1, // ID utilisateur par défaut
    content: ''
  };
  
  constructor(private commentService: CommentService) {}
  
  ngOnInit(): void {
    if (this.postId) {
      this.loadComments();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId'] && this.postId) {
      this.loadComments();
    }
  }
  
  // Charger les commentaires
  loadComments(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.commentService.getCommentsByPost(this.postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.newComment.postId = this.postId;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des commentaires';
        console.error('Error loading comments:', error);
        this.loading = false;
      }
    });
  }
  
  // Ajouter un commentaire
  addComment(): void {
    if (!this.newComment.content.trim()) {
      return;
    }
    
    this.commentService.createComment(this.newComment).subscribe({
      next: (createdComment) => {
        this.comments.push(createdComment);
        this.newComment.content = ''; // Réinitialiser le champ
      },
      error: (error) => {
        console.error('Error creating comment:', error);
      }
    });
  }
  
  // Supprimer un commentaire
  deleteComment(commentId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id !== commentId);
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
        }
      });
    }
  }
  
  // Formater la date
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Calculer le temps écoulé
  getTimeAgo(dateString?: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'à l\'instant';
    if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`;
    if (seconds < 2592000) return `il y a ${Math.floor(seconds / 86400)}j`;
    return this.formatDate(dateString);
  }
}