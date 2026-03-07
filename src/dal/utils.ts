import "server-only";

export function calculatePriceInDollars(price: number) {
  return price / 100;
}

export function convertPriceForDb(price: number) {
  return price * 100;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
