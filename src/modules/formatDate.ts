const padZero = (number) => (number < 10 ? '0' + number : number);

export const formatDate = (date) => {
  const d = new Date(date);
  const day = padZero(d.getDate());
  const month = padZero(d.getMonth() + 1);
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export const createGermanDateTime = () => {
  const d = new Date();
  const day = padZero(d.getDate());
  const month = padZero(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = padZero(d.getHours());
  const minutes = padZero(d.getMinutes());
  const seconds = padZero(d.getSeconds());
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};
