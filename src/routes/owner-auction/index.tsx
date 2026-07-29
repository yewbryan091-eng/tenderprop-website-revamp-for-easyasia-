import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/tender/PageShell";

export const Route = createFileRoute("/owner-auction/")({ component: Page });

function Page() {
  return (
    <PageShell
      eyebrow="Live bidding, on the owner's terms"
      title={<>Owner <em>Private Auction</em></>}
      lede="Owners voluntarily offer their property to qualified buyers through open bidding on a fixed date, conducted by a licensed auctioneer — not a bank foreclosure. Deposit is 3% of your bidding price, and you can inspect the property before auction day."
      frames={[
        { title: "Next auction — date + countdown", what: "The auction date is this page's heartbeat, same pattern as the tender cycle." },
        { title: "Not a bank auction", what: "The single most common confusion in Malaysia, answered above the listings — voluntary, owner-initiated, reserve set by valuation." },
        { title: "Auction listings", what: "Reuses the tender card component with auction date + time.", blocked: "real records — live site still shows 'test' data and RM- prices" },
        { title: "How to bid", what: "The 6 steps from the live how-to-bid page, rewritten (its 'How To Bid?' intro is lorem ipsum today)." },
        { title: "Licensed auctioneer note", what: "Legally load-bearing and currently absent from the live page.", blocked: "auctioneer name/licence" },
      ]}
    />
  );
}
