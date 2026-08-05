import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { TENDERS } from "@/data/tenders";
import { MS_DAY, daysLeft, isFinalDay, ordinalDateParts, remainingMs } from "@/lib/tender-utils";
import "@/styles/tender-listings.css";
import "@/styles/home.css";

export const Route = createFileRoute("/")({ component: HomePage });

/* HOMEPAGE HERO — iteration 01. Founder decisions, 5 Aug 2026 (loop/iteration-state.md §2):
   right panel is the REAL cycle + countdown; a new composition rather than /tender's
   diagonal split; NO search until /tender can actually receive a query; the seller path
   is present but secondary and never a second red button.

   This page deliberately no longer uses PageShell. PageShell's plain type-stack hero and
   its dashed "page frame" grid are scaffolding for pages that are not yet designed, and it
   is shared by eight other routes — so the homepage owning its own composition keeps this
   loop out of a high-collision file entirely. */

/* The cycle is derived from REAL listings only. The 12 `demo: true` records are fabricated
   state-coverage fillers that get deleted before go-live, so any count including them would
   change the day they go. None currently fall in the next cycle; deriving it this way means
   the number stays true either way. */
const REAL = TENDERS.filter((t) => !t.demo);
const NEXT_CYCLE = REAL.map((t) => t.closingDate).sort()[0];
const IN_CYCLE = REAL.filter((t) => t.closingDate === NEXT_CYCLE);

/* Clock-derived, so it starts null and fills on mount — otherwise the server render and the
   browser disagree (DESIGN-SYSTEM §5.8). Days lead, per the founder's rule via his father.
   The ticking H/M/S strip on /tender was a decision for THAT hero; a seconds counter in the
   homepage's first viewport is the urgency theatre a sealed e-tender must not have. One
   refresh a minute is all a day count needs, and all the final-day hours reading needs. */
type Left = { days: number; hours: number; minutes: number; finalDay: boolean };

function useDaysLeft(iso: string): Left | null {
  const [left, setLeft] = useState<Left | null>(null);
  useEffect(() => {
    const compute = (): Left => {
      const ms = remainingMs(iso);
      return {
        days: daysLeft(iso),
        hours: Math.floor((ms % MS_DAY) / 3_600_000),
        minutes: Math.floor((ms % 3_600_000) / 60_000),
        finalDay: isFinalDay(iso),
      };
    };
    setLeft(compute());
    const id = window.setInterval(() => setLeft(compute()), 60_000);
    return () => window.clearInterval(id);
  }, [iso]);
  return left;
}

function HomePage() {
  const left = useDaysLeft(NEXT_CYCLE);
  const close = ordinalDateParts(NEXT_CYCLE);
  const finalDay = Boolean(left) && left!.finalDay;

  /* Non-breaking space before mount so the figure reserves its own height and the card
     does not jump when the count lands. */
  const countValue = !left
    ? " "
    : finalDay
      ? `${left.hours}h ${String(left.minutes).padStart(2, "0")}m`
      : left.days.toLocaleString("en-MY");
  const countUnit = !left
    ? " "
    : finalDay
      ? "left today"
      : left.days === 1
        ? "day left"
        : "days left";
  /* One spoken label for the whole figure. Two live regions reading a number and its unit
     separately is hostile, and the date below already carries the deadline in full. */
  const countLabel = !left
    ? `Offers close ${close.day} ${close.month} ${close.year}`
    : finalDay
      ? "Offers close today"
      : `${left.days} days until offers close`;

  return (
    <div className="home">
      {/* The established TenderProp skip-link, same class and same placement as /tender's
          (first child, before the header). `tabIndex={-1}` on the target so focus actually
          lands there — an anchor alone moves the viewport but not always the focus ring. */}
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="hp-hero" aria-labelledby="hp-title">
          <div className="wrap hp-grid">
            {/* LEFT ~55% — what this is, and the one way in */}
            <div className="hp-say">
              <p className="hp-kick">Sealed E-Tender · Malaysia</p>
              <h1 id="hp-title">
                Name <em>your own price</em> for Malaysian property
              </h1>
              <p className="hp-lede">
                Every E-Tender listing carries a reserve price as a guide and one closing date. You
                decide what to offer — sealed and private, with nobody seeing another buyer's number
                — and TenderProp puts your offer in front of the seller.
              </p>
              <div className="hp-act">
                <Link className="btn red" to="/tender">
                  Browse open E-Tenders
                </Link>
                {/* Q4: secondary, never a second red button. Only the link text is the
                    anchor — wrapping the whole sentence would navigate on a click that
                    does not look clickable (DESIGN-SYSTEM §5, hit area vs affordance). */}
                <p className="hp-seller">
                  Selling a property? <Link to="/sell">See how E-Tender works for owners</Link>
                </p>
              </div>
            </div>

            {/* RIGHT ~45% — the CYCLE, and only the cycle.
                ITERATION 02, accepted fix: the five-row property/reserve ledger is REMOVED.
                Surface 1 establishes the product and the current cycle; Surface 2 owns
                property-level inventory and proof. Nothing replaced it — an empty space is
                the honest result of removing something, and filling it would just be the
                ledger again in another costume. */}
            <aside className="hp-cycle" aria-labelledby="hp-cycle-kick">
              <p className="hp-cycle-kick" id="hp-cycle-kick">
                Next E-Tender cycle · {IN_CYCLE.length} properties
              </p>
              <p className="hp-cycle-count" aria-label={countLabel}>
                <span className="hp-cycle-n" aria-hidden="true">
                  {countValue}
                </span>
                <span className="hp-cycle-u" aria-hidden="true">
                  {countUnit}
                </span>
              </p>
              <p className="hp-cycle-date">
                Offers close{" "}
                <b>
                  {close.day}
                  <sup>{close.suffix}</sup> {close.month} {close.year}
                </b>
              </p>
              {/* Reworded, not restyled. With the table gone this line sat directly under
                  "Offers close 12th December 2026" and read "Offers close … Offers close".
                  It still carries the one fact nothing else does — founder-confirmed, there
                  is no intra-day cut-off; a cycle runs to the end of its closing date. */}
              <p className="hp-cycle-foot">Closing is end of day, Malaysian time.</p>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
