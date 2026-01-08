import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { Post, CreatePostDTO } from '../../models/post';
import { Comment, CreateCommentDTO } from '../../models/comment';
import { CommentListComponent } from "../comment-list/comment-list.component";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  // Posts
  posts: Post[] = [];
  showPosts = true;
  
  // Nouveau post
  newPost: CreatePostDTO = {
    userId: 1, // ID utilisateur par défaut (peut être dynamique)
    title: '',
    content: ''
  };
  
  // Nouveau commentaire
  newComment: CreateCommentDTO = {
    postId: 0,
    userId: 1,
    content: ''
  };
  
  // État UI
  showCreateForm = false;
  showCommentsForPostId: number | null = null;
  loading = false;
  errorMessage = '';
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPosts = 0;
Math: any;
  
  constructor(
    private postService: PostService,
    private commentService: CommentService
  ) {}
  
  ngOnInit(): void {
    this.loadPosts();
  }
  
  // Charger tous les posts
  loadPosts(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.totalPosts = posts.length;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des posts';
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    });
  }
  
  // Créer un nouveau post
  createPost(): void {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    this.postService.createPost(this.newPost).subscribe({
      next: (createdPost) => {
        this.posts.unshift(createdPost); // Ajouter au début de la liste
        this.totalPosts++;
        
        // Réinitialiser le formulaire
        this.newPost = {
          userId: 1,
          title: '',
          content: ''
        };
        
        this.showCreateForm = false;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création du post';
        console.error('Error creating post:', error);
        this.loading = false;
      }
    });
  }
  
  // Upvoter un post
  upvotePost(postId: number): void {
    this.postService.upvotePost(postId).subscribe({
      next: (updatedPost) => {
        const index = this.posts.findIndex(p => p.id === postId);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
      },
      error: (error) => {
        console.error('Error upvoting post:', error);
      }
    });
  }
  
  // Supprimer un post
  deletePost(postId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== postId);
          this.totalPosts--;
          
          // Si on supprime le post dont on affiche les commentaires
          if (this.showCommentsForPostId === postId) {
            this.showCommentsForPostId = null;
          }
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }
  
  // Basculer l'affichage des commentaires pour un post
  toggleComments(postId: number): void {
    if (this.showCommentsForPostId === postId) {
      this.showCommentsForPostId = null;
    } else {
      this.showCommentsForPostId = postId;
    }
  }
  
  // Ajouter un commentaire
  addComment(postId: number): void {
    if (!this.newComment.content.trim()) {
      return;
    }
    
    const commentToCreate: CreateCommentDTO = {
      postId: postId,
      userId: 1, // ID utilisateur par défaut
      content: this.newComment.content
    };
    
    this.commentService.createComment(commentToCreate).subscribe({
      next: (createdComment) => {
        // Réinitialiser le champ de commentaire
        this.newComment.content = '';
        
        // Recharger les commentaires si le post est ouvert
        if (this.showCommentsForPostId === postId) {
          // On pourrait aussi ajouter le commentaire directement à la liste
          // mais pour simplifier, on rafraîchit les commentaires
        }
      },
      error: (error) => {
        console.error('Error creating comment:', error);
      }
    });
  }
  
  // Formater la date
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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