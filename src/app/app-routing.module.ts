import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { ExercicesComponent } from './exercices/exercices.component';
import { PatientExercisesComponent } from './components/patient-exercises/patient-exercises.component';
import { CoachExercisesComponent } from './components/coach-exercises/coach-exercises.component';
import { ListEvaluationComponent } from './components/list-evaluation/list-evaluation.component';
import { PatientMoodChartComponent } from './components/patient-mood-chart/patient-mood-chart.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { CoachProfileComponent } from './components/coach-profile/coach-profile.component';
import { PostListComponent } from './components/post-list/post-list.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'graphique', component: PatientMoodChartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'coach-profile/:id', component: CoachProfileComponent },
  { path: 'mood', component: EvaluationComponent },
  { path: 'ex/:idPatient', component: ExercicesComponent },
  { path: 'ex-pas', component: PatientExercisesComponent },
  { path: 'ex-coa', component: CoachExercisesComponent },
  { path: 'list-eva', component: ListEvaluationComponent },
  { path: 'posts', component: PostListComponent },{ path: 'admin-users', component: AdminUsersComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }