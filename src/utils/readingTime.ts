// src/utils/readingTime.ts
export function readingTime(body: string): number {
  const words = body.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
