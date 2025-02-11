

export const getDisabledDates = (earliest: string, latest: string) => {
  if (!earliest || !latest) return [];

  const start = new Date(earliest);
  const end = new Date(latest);
  const dateArray = [];

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  return dateArray;
};
