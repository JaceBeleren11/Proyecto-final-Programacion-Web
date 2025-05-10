import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  uploadProgress = 0;
  uploadComplete = false;
  uploadError = '';
  uploadedData: any[] = [];
  displayedColumns: string[] = [];
  currentPage = 0;
  pageSize = 5;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'El archivo es demasiado grande (máximo 5MB)';
      return;
    }

    // Validar extensión
    if (!file.name.match(/\.(csv|json)$/i)) {
      this.uploadError = 'Solo se permiten archivos CSV o JSON';
      return;
    }

    this.selectedFile = file;
    this.resetUploadState();
  }

  resetUploadState(): void {
    this.uploadProgress = 0;
    this.uploadComplete = false;
    this.uploadError = '';
    this.uploadedData = [];
    this.displayedColumns = [];
    this.currentPage = 0;
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Por favor selecciona un archivo';
      return;
    }

    this.resetUploadState();
    
    // Simulación de carga con progreso
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.processFile();
      }
    }, 200);
  }

  private processFile(): void {
    if (!this.selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const content = fileReader.result as string;
        
        if (this.selectedFile?.name.toLowerCase().endsWith('.csv')) {
          this.processCSV(content);
        } else if (this.selectedFile?.name.toLowerCase().endsWith('.json')) {
          this.processJSON(content);
        }
        
        this.uploadComplete = true;
      } catch (error) {
        this.uploadError = `Error al procesar el archivo: ${(error as Error).message}`;
        console.error('File processing error:', error);
        this.uploadProgress = 0;
      }
    };
    
    fileReader.onerror = () => {
      this.uploadError = 'Error al leer el archivo';
      this.uploadProgress = 0;
    };

    // Especificar codificación UTF-8 para caracteres especiales
    fileReader.readAsText(this.selectedFile, 'UTF-8');
  }

  private processCSV(content: string): void {
    try {
      // Normalizar saltos de línea
      const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
      const nonEmptyLines = lines.filter(line => line.trim() !== '');
      
      if (nonEmptyLines.length === 0) {
        throw new Error('El archivo CSV está vacío');
      }

      // Procesar headers
      const headers = this.parseCSVLine(nonEmptyLines[0]);
      
      this.displayedColumns = headers;
      this.uploadedData = [];
      
      // Procesar filas
      for (let i = 1; i < nonEmptyLines.length; i++) {
        const values = this.parseCSVLine(nonEmptyLines[i]);
        const entry: any = {};
        
        headers.forEach((header, index) => {
          entry[header] = values[index] || '';
        });
        
        this.uploadedData.push(entry);
      }
    } catch (error) {
      throw new Error(`Error en CSV: ${(error as Error).message}`);
    }
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Comilla escapada
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result.map(item => item.trim());
  }

  private processJSON(content: string): void {
    try {
      const data = JSON.parse(content);
      
      if (!Array.isArray(data)) {
        throw new Error('El archivo JSON debe contener un array');
      }
      
      if (data.length === 0) {
        throw new Error('El array JSON está vacío');
      }

      this.displayedColumns = Object.keys(data[0]);
      this.uploadedData = data;
    } catch (error) {
      throw new Error(`Error en JSON: ${(error as Error).message}`);
    }
  }

  // Métodos para paginación
  get paginatedData() {
    const start = this.currentPage * this.pageSize;
    return this.uploadedData.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.uploadedData.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}