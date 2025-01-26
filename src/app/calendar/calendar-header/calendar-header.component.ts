import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
  standalone: false
})
export class CalendarHeaderComponent implements OnInit {
  currentDate: Date = new Date();

  @Output() navigateDate = new EventEmitter<Date>();
  @Output() createAppointment = new EventEmitter<void>();

  ngOnInit(): void {
    this.emitDateChange();
  }

  emitDateChange(): void {
    this.navigateDate.emit(this.currentDate);
  }

  goToPreviousDay(): void {
    this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() - 1));
    this.emitDateChange();
  }

  goToNextDay(): void {
    this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() + 1));
    this.emitDateChange();
  }

  onCreateAppointment(): void {
    this.createAppointment.emit();
  }
  
}
