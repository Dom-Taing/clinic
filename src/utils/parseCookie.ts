export function getCookieValue(
  cookieString: string | undefined,
  key: string
): string | null {
  if (!cookieString) return null;

  const cookies = Object.fromEntries(
    cookieString.split("; ").map((c) => c.split("=").map(decodeURIComponent))
  );

  return cookies[key] || null;
}
