import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-patient-mood-chart',
  templateUrl: './patient-mood-chart.component.html',
  styleUrls: ['./patient-mood-chart.component.scss']
})
export class PatientMoodChartComponent implements AfterViewInit, OnDestroy {

  @Input() patientData: any[] = [];
  @Input() doctorData: any[] = [];

  patientChart: any;
  doctorChart: any;

  ngAfterViewInit() {
    // Attendre un peu le rendu HTML + les Inputs venant du parent
    setTimeout(() => {
      this.createPatientChart();
      this.createDoctorChart();
    }, 200);
  }

  ngOnDestroy(): void {
    if (this.patientChart) this.patientChart.destroy();
    if (this.doctorChart) this.doctorChart.destroy();
  }

  createPatientChart() {
    const canvas = document.getElementById('patientMoodChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels = this.patientData.map(d => d.date);
    const humeur = this.patientData.map(d => d.humeur);
    const stress = this.patientData.map(d => d.stress);
    const energie = this.patientData.map(d => d.energie);

    this.patientChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: "Humeur",
            data: humeur,
            borderColor: "#007bff",
            borderWidth: 2,
            fill: false,
            tension: 0.3
          },
          {
            label: "Stress",
            data: stress,
            borderColor: "#dc3545",
            borderWidth: 2,
            fill: false,
            tension: 0.3
          },
          {
            label: "Énergie",
            data: energie,
            borderColor: "#28a745",
            borderWidth: 2,
            fill: false,
            tension: 0.3
          }
        ]
      }
    });
  }

  createDoctorChart() {
    const canvas = document.getElementById('doctorReviewChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels = this.doctorData.map(d => d.date);
    const risk = this.doctorData.map(d => d.riskLevel);

    this.doctorChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: "Niveau de risque (Docteur)",
            data: risk,
            backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
          }
        ]
      }
    });
  }
}
