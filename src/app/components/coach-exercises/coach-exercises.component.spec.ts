import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachExercisesComponent } from './coach-exercises.component';

describe('CoachExercisesComponent', () => {
  let component: CoachExercisesComponent;
  let fixture: ComponentFixture<CoachExercisesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachExercisesComponent]
    });
    fixture = TestBed.createComponent(CoachExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
