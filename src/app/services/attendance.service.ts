import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface WeeklyData {
  attendance: number[];
  lateArrivals: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://tu-api.com/attendance';

  constructor(private http: HttpClient) {}

  getWeeklyData(): Observable<WeeklyData> {
    return this.http.get<WeeklyData>(`${this.apiUrl}/weekly`);
  }
}