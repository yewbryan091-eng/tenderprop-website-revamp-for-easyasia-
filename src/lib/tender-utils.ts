import type { Tender } from "@/data/tenders";
import { TYPE_TAXONOMY } from "@/data/tender-taxonomy";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtPrice(p: number) {
  return p > 0 ? "RM" + p.toLocaleString("en-MY") : "On application";
}

export function fmtRM(n: number) {
  return n >= 1000000
    ? "RM" + (n / 1000000).toString().replace(/\.0$/, "") + "m"
    : "RM" + Math.round(n / 1000) + "k";
}

export function daysLeft(iso: string) {
  return Math.ceil((new Date(iso + "T23:59:59").getTime() - Date.now()) / 86400000);
}

/* Deposit: listings with a published deposit carry `deposit`. Others fall back to
   3% of reserve, the figure published in the live How-To-Tender FAQ.
   Placeholder rule — verify with the agency before go-live. */
export function depositOf(x: Tender) {
  if (x.deposit) return "RM" + x.deposit.toLocaleString("en-MY");
  return x.reservePrice ? "RM" + Math.round(x.reservePrice * 0.03).toLocaleString("en-MY") : "On application";
}

export function tenderId(x: Tender) {
  return (x.name + "-" + x.area).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function inPriceRange(price: number, range: string) {
  if (range === "500k-below") return price > 0 && price <= 500000;
  if (range === "501k-1mil") return price > 500000 && price <= 1000000;
  if (range === "1mil-2mil") return price > 1000000 && price <= 2000000;
  if (range === "2mil-above") return price > 2000000;
  return false;
}

const TYPE_BY_VALUE: Record<string, (typeof TYPE_TAXONOMY)[number]> = {};
TYPE_TAXONOMY.forEach((t) => { TYPE_BY_VALUE[t.value] = t; });
export { TYPE_BY_VALUE };

export function matchesTaxonomy(x: Tender, value: string) {
  const t = TYPE_BY_VALUE[value];
  if (!t || value === "all") return true;
  if (t.cat) return x.propertyCategory === t.cat;
  return (t.types || []).indexOf(x.propertyType) !== -1;
}

/* Only these detail pages exist so far; everything else degrades to a
   coming-soon route instead of a hard 404. */
export const BUILT_PAGES: Record<string, string> = {
  "residensi-sinaran-shah-alam": "/tender/residensi-sinaran",
};
export function hrefFor(x: Tender) {
  return BUILT_PAGES[tenderId(x)] || "/tender/coming-soon";
}
