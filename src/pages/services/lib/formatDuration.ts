export const formatDuration = (minutes: number): string => {
  if (minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} мин`;
  if (mins === 0) {
    return hours === 1 ? '1 час' : `${hours} часа`;
  }
  const hourLabel = hours === 1 ? '1 час' : `${hours} часа`;
  return `${hourLabel} ${mins} минут`;
};
