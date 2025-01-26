import { Component } from '@angular/core';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false
})
export class CalendarComponent {
  currentDate!: Date;

  onDateChange(date: Date): void {
    this.currentDate = date;
    console.log('Current date updated:', this.currentDate);
  }

  onCreateAppointment(): void {
    console.log('Create Appointment clicked!');
    // Open the appointment form dialog (we'll add this later)
  }
}
