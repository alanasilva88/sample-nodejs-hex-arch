export class DateUtil {
    static convertToDate(value: any): Date | null {
      try {
        // Se o valor tem método toDate (Firestore Timestamp)
        if (value && typeof value.toDate === 'function') {
          return value.toDate();
        }
        
        // Se já é uma data ou string de data válida
        if (value) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
        
        return null;
      } catch {
        return null;
      }
    }
  }