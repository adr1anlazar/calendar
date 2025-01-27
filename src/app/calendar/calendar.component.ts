import { Component } from '@angular/core';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false
})
export class CalendarComponent {
  currentDate: Date = new Date();
  selectedHour: number | null = null;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  appointments: { time: Date; title: string }[] = [];

  onDateChange(date: Date): void {
    this.currentDate = date;
    console.log('Date updated to:', this.currentDate);
  }

  onGridClick(hour: number): void {
    this.selectedHour = hour;
    this.openAppointmentModal();
  }

  calculateTop(time: Date): number {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const slotHeight = 60;
    return hour * slotHeight + (minute / 60) * slotHeight;
  }


  openAppointmentModal(): void {
    console.log('Opening appointment modal for hour:', this.selectedHour);
    // TODO: Open the modal
  }

  saveAppointment(time: Date, title: string): void {
    this.appointments.push({ time, title });
    console.log('Saved appointment:', { time, title });
  }
}
