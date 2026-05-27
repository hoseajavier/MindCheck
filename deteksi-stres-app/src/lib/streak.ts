export function calculateStreak(
  lastQuizDate: Date | null,
  currentStreak: number
) {
  const now = new Date();

  const adjustedNow = new Date(now);
  adjustedNow.setHours(adjustedNow.getHours() - 8);

  if (!lastQuizDate) {
    return 1;
  }

  const adjustedLast = new Date(lastQuizDate);
  adjustedLast.setHours(adjustedLast.getHours() - 8);

  const nowDate = new Date(adjustedNow.toDateString());
  const lastDate = new Date(adjustedLast.toDateString());

  const diffTime = nowDate.getTime() - lastDate.getTime();

  const diffDays = Math.floor(
    diffTime / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return currentStreak;
  }

  if (diffDays === 1) {
    return currentStreak + 1;
  }

  return 1;
}