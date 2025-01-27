import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';

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
  appointments: { title: string; description: string; startTime: Date; endTime: Date }[] = [];

  constructor(private dialog: MatDialog) { }

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

  calculateHeight(startTime: Date, endTime: Date): number {
    const slotHeight = 60;
    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return ((durationInMinutes / 60) * slotHeight) - 8; // 8 from padding
  }

  openAppointmentModal(existingAppointment: any = null): void {
    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      width: '400px',
      data: existingAppointment
        ? {
          title: existingAppointment.title,
          description: existingAppointment.description,
          startTime: this.formatTime(existingAppointment.startTime),
          endTime: this.formatTime(existingAppointment.endTime),
        }
        : {
          defaultTime: '00:00',
          selectedHour: this.selectedHour,
        },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (existingAppointment) {
          this.updateAppointment(existingAppointment, result);
        } else {
          this.saveAppointment(result);
        }
      }
    });
  }

  saveAppointment(data: { title: string; description: string; startTime: string; endTime: string }): void {
    const startTime = this.createDateFromTime(data.startTime);
    const endTime = this.createDateFromTime(data.endTime);

    this.appointments.push({ ...data, startTime, endTime });
    console.log('Appointments:', this.appointments);
  }

  updateAppointment(
    existingAppointment: { title: string; description: string; startTime: Date; endTime: Date },
    updatedData: { title: string; description: string; startTime: string; endTime: string }
  ): void {
    const index = this.appointments.indexOf(existingAppointment);
    if (index !== -1) {
      const startTime = this.createDateFromTime(updatedData.startTime);
      const endTime = this.createDateFromTime(updatedData.endTime);

      this.appointments[index] = { ...updatedData, startTime, endTime };
      console.log('Updated Appointments:', this.appointments);
    }
  }

  createDateFromTime(time: string): Date {
    const [hour, minute] = time.split(':').map(Number);
    const date = new Date(this.currentDate);
    date.setHours(hour, minute, 0, 0);
    return date;
  }

  formatTime(date: Date): string {
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }
}
