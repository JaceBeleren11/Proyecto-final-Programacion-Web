import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent {
  // Tipos de asistencia con tipo seguro
  attendanceStatus: { [key: string]: string } = {
    P: 'Presente',
    A: 'Ausente',
    J: 'Justificado',
    T: 'Tardanza'
  };

  // Generar 15 días de clases
  classDays = Array.from({length: 15}, (_, i) => 
    new Date(2023, 0, i + 1).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit'})
  );

  // 30 estudiantes con datos de ejemplo
  students = [
    {id: 1, name: 'Juan Pérez', grade: '5°A', attendance: this.generateRandomAttendance()},
    {id: 2, name: 'María García', grade: '5°A', attendance: this.generateRandomAttendance()},
    {id: 3, name: 'Carlos López', grade: '5°B', attendance: this.generateRandomAttendance()},
    {id: 4, name: 'Ana Martínez', grade: '5°B', attendance: this.generateRandomAttendance()},
    {id: 5, name: 'Luis Rodríguez', grade: '6°A', attendance: this.generateRandomAttendance()},
    {id: 6, name: 'Sofía Hernández', grade: '6°A', attendance: this.generateRandomAttendance()},
    {id: 7, name: 'Pedro Díaz', grade: '6°B', attendance: this.generateRandomAttendance()},
    {id: 8, name: 'Laura Gómez', grade: '6°B', attendance: this.generateRandomAttendance()},
    {id: 9, name: 'Jorge Ruiz', grade: '7°A', attendance: this.generateRandomAttendance()},
    {id: 10, name: 'Mónica Castro', grade: '7°A', attendance: this.generateRandomAttendance()},
    {id: 11, name: 'Andrés Vargas', grade: '5°A', attendance: this.generateRandomAttendance()},
    {id: 12, name: 'Lucía Medina', grade: '5°A', attendance: this.generateRandomAttendance()},
    {id: 13, name: 'Fernando Soto', grade: '5°B', attendance: this.generateRandomAttendance()},
    {id: 14, name: 'Daniela Ríos', grade: '5°B', attendance: this.generateRandomAttendance()},
    {id: 15, name: 'Roberto Mora', grade: '6°A', attendance: this.generateRandomAttendance()},
    {id: 16, name: 'Patricia León', grade: '6°A', attendance: this.generateRandomAttendance()},
    {id: 17, name: 'Ricardo Herrera', grade: '6°B', attendance: this.generateRandomAttendance()},
    {id: 18, name: 'Adriana Castro', grade: '6°B', attendance: this.generateRandomAttendance()},
    {id: 19, name: 'José Guzmán', grade: '7°A', attendance: this.generateRandomAttendance()},
    {id: 20, name: 'Gabriela Silva', grade: '7°A', attendance: this.generateRandomAttendance()},
    {id: 21, name: 'Mario Fernández', grade: '5°A', attendance: this.generateRandomAttendance()},
    {id: 22, name: 'Isabel Torres', grade: '5°A', attendance: this.generateRandomAttendance()},
    {id: 23, name: 'Héctor Navarro', grade: '5°B', attendance: this.generateRandomAttendance()},
    {id: 24, name: 'Elena Ramírez', grade: '5°B', attendance: this.generateRandomAttendance()},
    {id: 25, name: 'Raúl Jiménez', grade: '6°A', attendance: this.generateRandomAttendance()},
    {id: 26, name: 'Teresa Mendoza', grade: '6°A', attendance: this.generateRandomAttendance()},
    {id: 27, name: 'Francisco Ortega', grade: '6°B', attendance: this.generateRandomAttendance()},
    {id: 28, name: 'Beatriz Reyes', grade: '6°B', attendance: this.generateRandomAttendance()},
    {id: 29, name: 'Arturo Sandoval', grade: '7°A', attendance: this.generateRandomAttendance()},
    {id: 30, name: 'Verónica Campos', grade: '7°A', attendance: this.generateRandomAttendance()}
  ];

  // Generar asistencia aleatoria
  private generateRandomAttendance(): string[] {
    return Array.from({length: 15}, () => {
      const rand = Math.random();
      if (rand > 0.85) return 'A'; // 15% ausente
      if (rand > 0.75) return 'J'; // 10% justificado
      if (rand > 0.70) return 'T'; // 5% tardanza
      return 'P'; // 70% presente
    });
  }

  // Calcular porcentaje de asistencia
  calculateAttendance(attendance: string[]): string {
    const presentDays = attendance.filter(a => a === 'P').length;
    return ((presentDays / attendance.length) * 100).toFixed(1) + '%';
  }

  // Filtrado
  filteredStudents = [...this.students];
  searchTerm = '';
  selectedGrade = 'all';

  filterStudents(): void {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesGrade = this.selectedGrade === 'all' || student.grade === this.selectedGrade;
      return matchesSearch && matchesGrade;
    });
  }

  // Exportar a Excel
  exportToExcel(): void {
    const data = this.filteredStudents.map(student => ({
      ID: student.id,
      Nombre: student.name,
      Grado: student.grade,
      'Asistencia Total': this.calculateAttendance(student.attendance),
      ...this.classDays.reduce((acc, day, index) => {
        acc[day] = this.attendanceStatus[student.attendance[index]];
        return acc;
      }, {} as {[key: string]: string})
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');
    XLSX.writeFile(wb, 'asistencia_escolar.xlsx');
  }

  // Exportar a PDF
  exportToPDF(): void {
    const doc = new jsPDF('landscape');
    const title = 'Reporte de Asistencia Escolar';
    
    // Cabecera
    doc.setFontSize(16);
    doc.text(title, 14, 10);
    
    // Datos principales
    autoTable(doc, {
      head: [['ID', 'Nombre', 'Grado', 'Asistencia', ...this.classDays]],
      body: this.filteredStudents.map(student => [
        student.id,
        student.name,
        student.grade,
        this.calculateAttendance(student.attendance),
        ...student.attendance.map(a => this.attendanceStatus[a])
      ]),
      startY: 20,
    });

    doc.save('asistencia_escolar.pdf');
  }
}