export function getTTLDateString(minutes, isPrevious = false) {
  const now = new Date();
  const expireTime = isPrevious
    ? now.getTime() - 1000 * 60 * 60 * 24
    : now.getTime() + 1000 * 60 * minutes;
  now.setTime(expireTime);
  console.log(now);
  return now.toUTCString();
}
