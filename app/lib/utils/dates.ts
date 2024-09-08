export function fromLocaleFormat(date: string) {
  const arr = date.split(".");

  return new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]), 12);
}

export function getDaysDiff(first: string, second: string) {
  const firstDate = fromLocaleFormat(first).getTime();
  const secondDate = fromLocaleFormat(second).getTime();

  return Math.round((secondDate - firstDate) / 1000 / 60 / 60 / 24);
}
