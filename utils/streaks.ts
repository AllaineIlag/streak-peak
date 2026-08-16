export function calculateCurrentStreak(checkinDates: string[]): number {
  if (checkinDates.length === 0) return 0;

  // Sort dates descending (newest first)
  const sorted = [...checkinDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Convert checkin string dates to Date objects normalized to midnight local time
  const normalizedDates = sorted.map((d) => {
    // If d is '2023-10-05', parsing it directly might give UTC midnight,
    // so we parse the parts locally to avoid timezone shifts.
    const [year, month, day] = d.split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  // Remove duplicates just in case
  const uniqueTimeSet = new Set(normalizedDates.map(d => d.getTime()));
  const uniqueDates = Array.from(uniqueTimeSet).map(time => new Date(time)).sort((a, b) => b.getTime() - a.getTime());

  if (uniqueDates.length === 0) return 0;

  // The streak must start either today or yesterday to be active
  let currentExpectedDate = uniqueDates[0].getTime() === today.getTime() ? today : yesterday;

  if (uniqueDates[0].getTime() !== today.getTime() && uniqueDates[0].getTime() !== yesterday.getTime()) {
    // Streak is broken (last check-in was before yesterday)
    return 0;
  }

  for (let i = 0; i < uniqueDates.length; i++) {
    if (uniqueDates[i].getTime() === currentExpectedDate.getTime()) {
      streak++;
      // Move expected date back one day
      currentExpectedDate.setDate(currentExpectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Returns an array of the last `days` dates in YYYY-MM-DD format,
 * sorted oldest to newest (for rendering a weekly strip).
 */
export function getLastNDays(days: number): string[] {
  const result: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);
  }

  return result;
}
