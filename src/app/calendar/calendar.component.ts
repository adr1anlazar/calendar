import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';
import { Appointment, AppointmentService } from './services/appointment.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  selectedHour: number | null = null;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  appointments: Appointment[] = [];
  loading: boolean = false;

  constructor(private dialog: MatDialog, private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.loading = true;
    this.appointmentService.getAppointments().pipe(
      catchError((error) => {
        console.error('Failed to fetch appointments:', error);
        this.loading = false;
        return of([]);
      })
    ).subscribe({
      next: (data: any) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (error: any) => console.error('Error during subscription:', error),
    });
  }

  onDateChange(newDate: Date): void {
    this.currentDate = new Date(newDate);
    this.fetchAppointments();
  }

  onGridClick(hour: number): void {
    this.selectedHour = hour;
    this.openAppointmentModal();
  }

  openAppointmentModal(existingAppointment: Appointment | null = null): void {
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
          this.createAppointment(result);
        }
      }
    });
  }

  createAppointment(data: { title: string; description: string; startTime: string; endTime: string }): void {
    const startTime = this.createDateFromTime(data.startTime);
    const endTime = this.createDateFromTime(data.endTime);
    const newAppointment: Appointment = { ...data, startTime, endTime };

    this.appointmentService.createAppointment(newAppointment).subscribe({
      next: (updatedList: any) => {
        this.appointments = updatedList;
      },
      error: (error: any) => console.error('Failed to create appointment:', error),
    });
  }

  updateAppointment(
    existingAppointment: Appointment,
    updatedData: { title: string; description: string; startTime: string; endTime: string }
  ): void {
    const startTime = this.createDateFromTime(updatedData.startTime);
    const endTime = this.createDateFromTime(updatedData.endTime);
    const updatedAppointment: Appointment = { ...updatedData, startTime, endTime };

    this.appointmentService.updateAppointment(existingAppointment, updatedAppointment).subscribe({
      next: (updatedList: any) => {
        this.appointments = updatedList;
      },
      error: (error: any) => console.error('Failed to update appointment:', error),
    });
  }

  deleteAppointment(appointment: Appointment, event: Event): void {
    event.stopPropagation();

    this.appointmentService.deleteAppointment(appointment).subscribe({
      next: (updatedList: any) => {
        this.appointments = updatedList;
      },
      error: (error: any) => console.error('Failed to delete appointment:', error),
    });
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
