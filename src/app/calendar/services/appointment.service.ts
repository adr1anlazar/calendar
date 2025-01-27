import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
    private appointments: Appointment[] = [];

    constructor() { }

    getAppointments(): Observable<Appointment[]> {
        return of(this.appointments).pipe(delay(500));
    }

    createAppointment(appointment: Appointment): Observable<Appointment[]> {
        this.appointments.push(appointment);
        return of([...this.appointments]).pipe(delay(500));
    }

    updateAppointment(existingAppointment: Appointment, updatedData: Appointment): Observable<Appointment[]> {
        const index = this.appointments.indexOf(existingAppointment);
        if (index !== -1) {
            this.appointments[index] = updatedData;
        }
        return of([...this.appointments]).pipe(delay(500));
    }

    deleteAppointment(appointment: Appointment): Observable<Appointment[]> {
        const index = this.appointments.indexOf(appointment);
        if (index !== -1) {
            this.appointments.splice(index, 1);
        }
        return of([...this.appointments]).pipe(delay(500));
    }
}
