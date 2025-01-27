import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.scss',
  standalone: false
})

export class AppointmentModalComponent {
  title: string = '';
  description: string = '';
  startTime: string = '';
  endTime: string = '';
  endTimeError: string = '';
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AppointmentModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title?: string; description?: string; startTime?: string; endTime?: string; defaultTime: string; selectedHour: number; }
  ) {
    if (data.title) {
      this.isEditMode = true;
      this.title = data.title || '';
      this.description = data.description || '';
      this.startTime = data.startTime || '';
      this.endTime = data.endTime || '';
    } else {
      const initialTime =
        this.data.selectedHour !== null
          ? `${this.data.selectedHour.toString().padStart(2, '0')}:00`
          : this.data.defaultTime;

      this.startTime = initialTime;

      if (this.data.selectedHour === 23) {
        this.endTime = '23:59';
      } else {
        this.endTime = this.calculateEndTime(initialTime);
      }
    }
  }

  calculateEndTime(startTime: string): string {
    const [hour, minute] = startTime.split(':').map(Number);
    const endHour = (hour + 1) % 24;
    return `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  save(): void {
    if (!this.isValid()) {
      return;
    }

    this.dialogRef.close({
      title: this.title,
      description: this.description,
      startTime: this.startTime,
      endTime: this.endTime,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  isValid(): boolean {
    let isFormValid = true;

    if (!this.title || this.title.trim() === '') {
      isFormValid = false;
    }

    const start = this.parseTime(this.startTime);
    const end = this.parseTime(this.endTime);

    if (end === 0 || end < start) {
      this.endTimeError = 'End time must be later than Start time.';
      isFormValid = false;
    } else {
      this.endTimeError = '';
    }

    return isFormValid;
  }

  parseTime(time: string): number {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  }
}
