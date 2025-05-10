import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../services/student.services';
import { Student } from '../models/student.model';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {
  students: Student[] = [];
  editingStudent: Student | null = null;
  newStudent = {
    name: '',
    grade: '',
    email: '',
    phone: ''
  };
  grades = ['5°A', '5°B', '6°A', '6°B', '7°A', '7°B'];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAll().subscribe({
      next: (data: Student[]) => this.students = data,
      error: (err: any) => console.error('Error loading students:', err)
    });
  }

  addStudent(): void {
    if (this.validateStudent(this.newStudent)) {
      const newId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
      this.students.push({ id: newId, ...this.newStudent });
      this.resetNewStudent();
    }
  }

  editStudent(student: Student): void {
    this.editingStudent = { ...student };
  }

  updateStudent(): void {
    if (this.editingStudent && this.validateStudent(this.editingStudent)) {
      const index = this.students.findIndex(s => s.id === this.editingStudent?.id);
      if (index !== -1) {
        this.students[index] = { ...this.editingStudent };
        this.cancelEdit();
      }
    }
  }

deleteStudent(id: number): void {
  if (confirm('¿Estás seguro de eliminar este estudiante?')) {
    this.students = this.students.filter(student => student.id !== id);
  }
}

  cancelEdit(): void {
    this.editingStudent = null;
  }

  private validateStudent(student: { name: string, grade: string, email: string }): boolean {
    if (!student.name || !student.grade || !student.email) {
      alert('Nombre, grado y email son campos requeridos');
      return false;
    }
    
    if (!student.email.includes('@')) {
      alert('Email no válido');
      return false;
    }
    
    return true;
  }

  private resetNewStudent(): void {
    this.newStudent = {
      name: '',
      grade: '',
      email: '',
      phone: ''
    };
  }
}