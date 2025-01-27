import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Appointment {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
}

@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    private appointmentsByDate: { [key: string]: Appointment[] } = {};

    constructor() { }

    private formatDateKey(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    getAppointments(date: Date): Observable<Appointment[]> {
        const dateKey = this.formatDateKey(date);
        return of(this.appointmentsByDate[dateKey] || []).pipe();
    }

    createAppointment(date: Date, appointment: Appointment): Observable<Appointment[]> {
        const dateKey = this.formatDateKey(date);
        if (!this.appointmentsByDate[dateKey]) {
            this.appointmentsByDate[dateKey] = [];
        }
        this.appointmentsByDate[dateKey].push(appointment);
        return of([...this.appointmentsByDate[dateKey]]).pipe();
    }

    updateAppointment(date: Date, existingAppointment: Appointment, updatedData: Appointment): Observable<Appointment[]> {
        const dateKey = this.formatDateKey(date);
        const appointments = this.appointmentsByDate[dateKey] || [];
        const index = appointments.indexOf(existingAppointment);
        if (index !== -1) {
            appointments[index] = updatedData;
        }
        this.appointmentsByDate[dateKey] = appointments;
        return of([...appointments]).pipe();
    }

    deleteAppointment(date: Date, appointment: Appointment): Observable<Appointment[]> {
        const dateKey = this.formatDateKey(date);
        const appointments = this.appointmentsByDate[dateKey] || [];
        const index = appointments.indexOf(appointment);
        if (index !== -1) {
            appointments.splice(index, 1);
        }
        this.appointmentsByDate[dateKey] = appointments;
        return of([...appointments]).pipe();
    }
}
