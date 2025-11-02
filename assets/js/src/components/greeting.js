function getHourInZone(timeZone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-AU', {
      hour: 'numeric',
      hour12: false,
      timeZone
    });
    const parts = formatter.formatToParts(new Date());
    const hourPart = parts.find((part) => part.type === 'hour');
    return hourPart ? Number(hourPart.value) : null;
  } catch (error) {
    return null;
  }
}

function getGreeting(hour) {
  if (hour == null) return 'Hello';
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function initGreeting(root = document) {
  const target = root.querySelector('[data-greeting]');
  if (!target) return;

  const localHour = new Date().getHours();
  const message = getGreeting(localHour);

  const sydneyHour = getHourInZone('Australia/Sydney');
  const bostonHour = getHourInZone('America/New_York');

  const isSydneyDay = sydneyHour != null && sydneyHour >= 6 && sydneyHour < 20;
  const isBostonDay = bostonHour != null && bostonHour >= 6 && bostonHour < 20;

  let location = 'Sydney & Boston';
  if (isSydneyDay && !isBostonDay) {
    location = 'Sydney';
  } else if (!isSydneyDay && isBostonDay) {
    location = 'Boston';
  } else if (isSydneyDay && isBostonDay) {
    location = 'Sydney and Boston';
  }

  target.textContent = `${message} from ${location}.`;
}
