import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';
import { Appointment, AppointmentService } from './services/appointment.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Utils } from './utils';

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

  onDateChange(newDate: Date): void {
    this.currentDate = new Date(newDate);
    this.fetchAppointments();
  }

  onGridClick(hour: number): void {
    this.selectedHour = hour;
    this.openAppointmentModal();
  }

  calculateTop(time: Date): number {
    return Utils.calculateTop(time);
  }

  calculateHeight(startTime: Date, endTime: Date): number {
    return Utils.calculateHeight(startTime, endTime);
  }

  createDateFromTime(time: string): Date {
    return Utils.createDateFromTime(time, this.currentDate);
  }

  formatTime(date: Date): string {
    return Utils.formatTime(date);
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

  fetchAppointments(): void {
    this.loading = true;
    this.appointmentService.getAppointments(this.currentDate).pipe(
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

  createAppointment(data: { title: string; description: string; startTime: string; endTime: string }): void {
    const startTime = this.createDateFromTime(data.startTime);
    const endTime = this.createDateFromTime(data.endTime);
    const newAppointment: Appointment = { ...data, startTime, endTime };

    this.appointmentService.createAppointment(this.currentDate, newAppointment).subscribe({
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

    this.appointmentService.updateAppointment(this.currentDate, existingAppointment, updatedAppointment).subscribe({
      next: (updatedList: any) => {
        this.appointments = updatedList;
      },
      error: (error: any) => console.error('Failed to update appointment:', error),
    });
  }

  deleteAppointment(appointment: Appointment, event: Event): void {
    event.stopPropagation();

    this.appointmentService.deleteAppointment(this.currentDate, appointment).subscribe({
      next: (updatedList: any) => {
        this.appointments = updatedList;
      },
      error: (error: any) => console.error('Failed to delete appointment:', error),
    });
  }
}
