import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { EmailJSResponseStatus } from 'emailjs-com';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { ExercicesComponent } from './exercices/exercices.component';
import { PatientExercisesComponent } from './components/patient-exercises/patient-exercises.component';
import { CoachExercisesComponent } from './components/coach-exercises/coach-exercises.component';
import { ListEvaluationComponent } from './components/list-evaluation/list-evaluation.component';
import { PatientMoodChartComponent } from './components/patient-mood-chart/patient-mood-chart.component';
 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ForgotPasswordComponent,
    NavbarComponent,
    ProfileComponent,
    EvaluationComponent,
    ExercicesComponent,
    PatientExercisesComponent,
    CoachExercisesComponent,
    ListEvaluationComponent,
    PatientMoodChartComponent

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }