import { z } from "zod";

export const convertNumberToTimeAgo = (n: number): string => {
  const now = new Date().getTime();
  const d = now - n;

  if (d < 0) {
    console.error(`convertNumberToTimeAgo: n is invalid value`);
    return "";
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

export const getDateComponents = (d: Date) => {
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();

  return { year, month, day };
};

export const toHostname = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch {
    return urlString;
  }
};

export const splitToken = (tokenStr: string) => {
  const split = tokenStr.split(":");
  return {
    username: split[0],
    token: split[1],
  };
};

export const addQueryParameter = (
  url: string,
  paramKey: string,
  paramValue: string
) => {
  const baseUrl = "https://example.com";
  const fullUrl = new URL(url, baseUrl);

  fullUrl.searchParams.append(paramKey, paramValue);

  return fullUrl.href.replace(baseUrl, "");
};

export const shouldShowMore = (
  totalCount: number,
  pageNumber: number,
  perPage: number
) => {
  return totalCount / (pageNumber * perPage) > 1;
};

export const getPageQuery = (params: {
  [key: string]: string | string[] | undefined;
}) => {
  const pageSchema = z.coerce.number().min(1);
  const pageSchemaResult = pageSchema.safeParse(params["p"]);
  if (pageSchemaResult.success) {
    return pageSchemaResult.data;
  }
  return 1;
};
