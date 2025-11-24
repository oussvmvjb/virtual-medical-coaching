import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMoodChartComponent } from './patient-mood-chart.component';

describe('PatientMoodChartComponent', () => {
  let component: PatientMoodChartComponent;
  let fixture: ComponentFixture<PatientMoodChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientMoodChartComponent]
    });
    fixture = TestBed.createComponent(PatientMoodChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
