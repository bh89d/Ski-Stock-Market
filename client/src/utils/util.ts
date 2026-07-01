export function percentageChange(prevClose: number, currentPrice: number) {
  const change = currentPrice - prevClose;
  const percentChange = (change / prevClose) * 100;
  return percentChange.toFixed(2);
}

export function dayRangePosition(currentPrice: number, dayHigh: number, dayLow: number) {
  const position = (currentPrice - dayLow) / (dayHigh - dayLow);
  return position * 100;
}

export function getCompanyAge(establishedAt: string) {
  const founded = new Date(establishedAt);
  const today = new Date();

  let age = today.getFullYear() - founded.getFullYear();

  const hasHadAnniversaryThisYear =
    today.getMonth() > founded.getMonth() ||
    (today.getMonth() === founded.getMonth() && today.getDate() >= founded.getDate());

  if (!hasHadAnniversaryThisYear) {
    age -= 1;
  }

  return age;
}

export function tickToTime(tick: number) {
  const OPEN_SESSION_TICKS = 480;
  const OPEN_SESSION_MINUTES = 420;
  const MARKET_OPEN_MINUTES = 9 * 60;

  const safeTick = Math.max(0, Math.min(tick, OPEN_SESSION_TICKS));
  const minutesFromOpen = Math.floor((safeTick * OPEN_SESSION_MINUTES) / OPEN_SESSION_TICKS);
  const totalMinutes = MARKET_OPEN_MINUTES + minutesFromOpen;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatMarketClock(tick: number) {
  const OPEN_SESSION_TICKS = 480;
  const OPEN_SESSION_MINUTES = 420;
  const MARKET_OPEN_MINUTES = 9 * 60;

  const safeTick = Math.max(0, Math.min(tick, OPEN_SESSION_TICKS));
  const totalMinutes =
    MARKET_OPEN_MINUTES +
    Math.floor((safeTick / OPEN_SESSION_TICKS) * OPEN_SESSION_MINUTES);

  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function marketMinutesToTimeLabel(minutesFromOpen: number) {
  const OPEN_SESSION_MINUTES = 420;
  const MARKET_OPEN_MINUTES = 9 * 60;

  const safeMinutes = Math.max(0, Math.min(minutesFromOpen, OPEN_SESSION_MINUTES));
  const totalMinutes = MARKET_OPEN_MINUTES + safeMinutes;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function marketMinutesToTick(minutesFromOpen: number) {
  const OPEN_SESSION_TICKS = 480;
  const OPEN_SESSION_MINUTES = 420;

  const safeMinutes = Math.max(0, Math.min(minutesFromOpen, OPEN_SESSION_MINUTES));
  return Math.round((safeMinutes / OPEN_SESSION_MINUTES) * OPEN_SESSION_TICKS);
}
