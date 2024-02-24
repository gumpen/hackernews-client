export const convertNumberToTimeAgo = (n: number): string => {
  const now = new Date().getTime();
  const d = now - n;

  if (d < 0) {
    console.error(`convertNumberToTimeAgo: n is invalid value`);
  }

  const seconds = Math.floor(d / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 1) {
    return `${years} years ago`;
  } else if (years === 1) {
    return "1 year ago";
  } else if (months > 1) {
    return `${months} months ago`;
  } else if (months === 1) {
    return "1 month ago";
  } else if (days > 1) {
    return `${days} days ago`;
  } else if (days === 1) {
    return "1 day ago";
  } else if (hours > 1) {
    return `${hours} hours ago`;
  } else if (hours === 1) {
    return "1 hour ago";
  } else if (minutes > 1) {
    return `${minutes} minutes ago`;
  } else if (minutes === 1) {
    return "1 minute ago";
  } else if (seconds > 1) {
    return `${seconds} seconds ago`;
  } else if (seconds === 1) {
    return "1 second ago";
  } else {
    return "just now";
  }
};

export const toHostname = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch {
    return urlString;
  }
};
