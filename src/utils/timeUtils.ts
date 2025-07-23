
export const parseTimeToMinutes = (timeStr: string): number => {
  if (timeStr.trim() === '0 min') return 0;
  
  const hourMatch = timeStr.match(/(\d+)\s*hrs?/);
  const minMatch = timeStr.match(/(\d+)\s*min/);
  
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minMatch ? parseInt(minMatch[1]) : 0;
  
  return hours * 60 + minutes;
};

export const parseTimeStringToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(Math.abs(minutes) / 60);
  const mins = Math.abs(minutes) % 60;
  
  if (minutes === 0) return '0 min';
  if (hours === 0) return `${minutes < 0 ? '-' : ''}${mins} min`;
  if (mins === 0) return `${minutes < 0 ? '-' : ''}${hours} hr${hours !== 1 ? 's' : ''}`;
  
  return `${minutes < 0 ? '-' : ''}${hours} hr${hours !== 1 ? 's' : ''}, ${mins} min`;
};

export const formatDifferenceTime = (minutes: number): string => {
  if (minutes === 0) return '0 min';
  const sign = minutes > 0 ? '+' : '';
  return `${sign}${minutesToTimeString(minutes)}`;
};

export const minutesToHoursMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) return `${minutes}:00`;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const minutesToHHMMSS = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

export const secondsToHHMMSS = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const parseTargetTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatTargetTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
