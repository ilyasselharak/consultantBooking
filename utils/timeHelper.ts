export const formatTimeToHHmm = (dateTime: Date) => {
  const date = new Date(dateTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

function formatDateToYYYYMMDD(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateToHHmm(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const compareTime = (time1: string, time2: string): boolean => {
  return toMinutes(time1) < toMinutes(time2);
};

export const countUnit = (startTime: string, endTime: string, unit: number): number => {
  return toMinutes(endTime) - toMinutes(startTime) / unit;
};

export const isOverlapping = (
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean => compareTime(start1, end2) && compareTime(start2, end1);
