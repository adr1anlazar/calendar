import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarHeaderComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MaterialModule
  ]
})
export class CalendarModule { }
