import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/tender/PageShell";

export const Route = createFileRoute("/sell/")({ component: Page });

function Page() {
  return (
    <PageShell
      eyebrow="For property owners — the revenue page"
      title={<>Sell by <em>tender or auction</em></>}
      lede="One date, sealed offers or open bidding, and TenderProp running everything: free valuation, free inspection, physical banners on your property, and buyers who have already paid a deposit to make their offer."
      frames={[
        { title: "E-Tender vs Owner Auction — the comparison", what: "How price is set, timeline, who bids, cost, who runs it, what if it doesn't sell. The highest-value element on the site; the live page has lorem ipsum here." },
        { title: "The banner flywheel", what: "Dual physical banners on every listing — the growth engine no portal can copy. An owner's first question is 'how will you market it?' Show the banner." },
        { title: "How to sell, step by step", what: "The 5 steps, rewritten — the live ones contain typos ('conduction', 'Particicape')." },
        { title: "The exclusive-agency terms, stated plainly", what: "Exclusive appointment; selling through another agency still owes commission. Say it here, not at signing." },
        { title: "Packages & pricing", what: "3-month vs 6-month listing packages.", blocked: "real RM figures" },
        { title: "Sold results + FAQ", what: "Real transactions only — the live page's 18 'Project ABC/XYZ' tiles are fabricated and stay out. The live Owner-Auction FAQ copy is good; keep and extend.", blocked: "real sold records" },
      ]}
    />
  );
}
