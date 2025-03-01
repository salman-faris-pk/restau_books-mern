export const getDisabledDates = (earliest: string, latest: string) => {
  if (!earliest || !latest) return [];

  const start = new Date(earliest);
  const end = new Date(latest);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dateArray = [];

  let pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);
  while (pastDate >= start) {
    dateArray.push(new Date(pastDate));
    pastDate.setDate(pastDate.getDate() - 1);
  }

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  return dateArray;
};
