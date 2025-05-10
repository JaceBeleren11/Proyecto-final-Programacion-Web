import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { AttendanceService } from '../services/attendance.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // KPIs
  kpis = [
    { title: 'Total Estudiantes', value: 125, change: '+5%', trend: 'up' },
    { title: 'Asistencia Hoy', value: 118, change: '+2%', trend: 'up' },
    { title: 'Ausencias', value: 7, change: '-1%', trend: 'down' },
    { title: 'Promedio Asistencia', value: '94%', change: '+1%', trend: 'up' }
  ];

  // Datos recientes de asistencia para la tabla
  recentAttendance = [
    { student: 'María González', date: '2023-05-15', status: 'Presente', time: '08:15', comments: '' },
    { student: 'Juan Pérez', date: '2023-05-15', status: 'Tardanza', time: '08:45', comments: 'Tráfico' },
    { student: 'Ana López', date: '2023-05-15', status: 'Presente', time: '08:10', comments: '' },
    { student: 'Carlos Ruiz', date: '2023-05-15', status: 'Ausente', time: '--', comments: 'Enfermedad' },
    { student: 'Sofía Martínez', date: '2023-05-14', status: 'Presente', time: '08:05', comments: '' }
  ];

  // Gráfica de barras
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }
    }
  };

  public barChartLabels: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { 
        data: [120, 115, 118, 122, 119], 
        label: 'Asistencia',
        backgroundColor: '#4CAF50',
        borderRadius: 4
      },
      { 
        data: [5, 8, 7, 3, 6], 
        label: 'Tardanzas',
        backgroundColor: '#FFC107',
        borderRadius: 4
      }
    ]
  };

  // Gráfica de pastel
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  public pieChartLabels: string[] = ['Presentes', 'Ausentes', 'Tardanzas'];
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartConfiguration['data'] = {
    labels: this.pieChartLabels,
    datasets: [{
      data: [450, 25, 30],
      backgroundColor: [
        '#4CAF50', // Verde para presentes
        '#F44336', // Rojo para ausentes
        '#FFC107'  // Amarillo para tardanzas
      ],
      borderWidth: 0
    }]
  };

  // Alertas
  alerts = [
    { message: '3 estudiantes con 3+ ausencias consecutivas', level: 'warning' },
    { message: 'Nuevo registro de asistencia pendiente de revisión', level: 'info' },
    { message: 'Actualización del sistema programada para hoy', level: 'info' }
  ];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.attendanceService.getWeeklyData().subscribe({
      next: (data: { attendance: number[], lateArrivals: number[] }) => {
        this.barChartData.datasets[0].data = data.attendance;
        this.barChartData.datasets[1].data = data.lateArrivals;
      },
      error: (err: any) => console.error('Error loading data:', err)
    });
  }
}