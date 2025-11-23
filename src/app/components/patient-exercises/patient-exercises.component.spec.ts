import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientExercisesComponent } from './patient-exercises.component';

describe('PatientExercisesComponent', () => {
  let component: PatientExercisesComponent;
  let fixture: ComponentFixture<PatientExercisesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientExercisesComponent]
    });
    fixture = TestBed.createComponent(PatientExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
