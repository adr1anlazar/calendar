export class Utils {
    static calculateTop(time: Date): number {
      const slotHeight = 60;
      return (time.getHours() * slotHeight) + (time.getMinutes() * slotHeight) / 60;
    }
  
    static calculateHeight(startTime: Date, endTime: Date): number {
      const slotHeight = 60;
      const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      return (durationInMinutes * slotHeight) / 60 - 8; // 8px for padding in css
    }
  
    static createDateFromTime(time: string, currentDate: Date): Date {
      const [hour, minute] = time.split(':').map(Number);
      const date = new Date(currentDate);
      date.setHours(hour, minute, 0, 0);
      return date;
    }
  
    static formatTime(date: Date): string {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  }
  