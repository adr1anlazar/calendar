import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarHeaderComponent,
    AppointmentModalComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FormsModule,
    MaterialModule
  ]
})
export class CalendarModule { }
