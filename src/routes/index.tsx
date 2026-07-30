import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/tender/PageShell";
import { TENDERS } from "@/data/tenders";
import { fmtDate } from "@/lib/tender-utils";

export const Route = createFileRoute("/")({ component: HomePage });

/* Deterministic: earliest closing date in the data, no clock involved. */
const NEXT_CYCLE = TENDERS.map((t) => t.closingDate).sort()[0];
const IN_CYCLE = TENDERS.filter((t) => t.closingDate === NEXT_CYCLE).length;

function HomePage() {
  return (
    <PageShell
      eyebrow="A new way to buy property in Malaysia"
      title={<>Property, sold by <em>sealed e-tender</em></>}
      lede="TenderProp runs batched E-Tenders and Owner Private Auctions for Malaysian property. Sealed offers, one closing date, and the whole transaction handled end to end — no drawn-out negotiation."
      frames={[
        { title: "How E-Tender works", what: "Sealed / batched / your deposit counts toward the 10% — the three-panel explainer, lifted from the e-tender grid hero." },
        { title: "Featured e-tender properties", what: "Cards from the built grid component, e-tender stock only. The cycle is the shelf." },
        { title: "Why your deposit is safe", what: "Stakeholder-held, refunded in full, counts toward your 10% — the licensing detail is disclosed here and in the footer, never in the headline." },
        { title: "Sell with us strip", what: "Free valuation + free inspection CTA into /sell.", blocked: "real package pricing" },
      ]}
    >
      <section className="home-doors">
        <div className="wrap">
          <div
            className="shell-hero"
            style={{ paddingTop: 0, paddingBottom: 18 }}
          >
            <p className="cycle-line">
              Next e-tender cycle: <b>{fmtDate(NEXT_CYCLE)}</b> · {IN_CYCLE} properties
            </p>
          </div>
          <div className="doors">
            <Link className="door is-live" to="/tender">
              <span className="k">Sealed offers · batch closing</span>
              <h2>E-Tender</h2>
              <p>
                Submit a private offer on a property before the cycle closes. Nobody sees your
                number; the seller responds — accept, counter, or your deposit back in full.
              </p>
              <span className="go">Browse the current cycle →</span>
            </Link>
            <Link className="door" to="/owner-auction">
              <span className="k">Live bidding · licensed auctioneer</span>
              <h2>Owner Private Auction</h2>
              <p>
                Owners voluntarily auction to qualified buyers on a set date — not a bank
                foreclosure. Open, transparent, inspect before you bid.
              </p>
              <span className="go">See upcoming auctions →</span>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
