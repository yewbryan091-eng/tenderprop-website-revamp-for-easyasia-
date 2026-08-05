import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { TENDERS } from "@/data/tenders";
import { MS_DAY, daysLeft, isFinalDay, ordinalDateParts, remainingMs } from "@/lib/tender-utils";
import "@/styles/tender-listings.css";
import "@/styles/home.css";

export const Route = createFileRoute("/")({ component: HomePage });

/* HOMEPAGE HERO — iteration 03. NEW ARCHITECTURE, from Bryan's reference, 5 Aug 2026.
   This supersedes the 55/45 card composition of iterations 01–02:

     · full-bleed DIAGONAL split, ~45 left / ~55 right
     · LEFT, on paper: "The smarter way to buy property."
     · RIGHT: the cycle over a KL image under a MAROON FADE

   The diagonal is built with the same technique as /tender's hero — two absolutely
   positioned, clip-path'd planes driven by top/bottom split tokens — but MIRRORED:
   /tender puts the dark plane on the left, this puts it on the right. Same vocabulary,
   opposite composition, so the front door and the listings page read as a pair rather
   than a repeat.

   ⚠️ The hero image is a PLACEHOLDER. Bryan is sourcing the real one. Swap it in one
   place: `--hp-hero-image` in home.css. */

/* Real listings only — the 12 `demo: true` records are fabricated state-coverage fillers
   deleted before go-live, so any count including them would change the day they go. */
const REAL = TENDERS.filter((t) => !t.demo);
const NEXT_CYCLE = REAL.map((t) => t.closingDate).sort()[0];
const IN_CYCLE = REAL.filter((t) => t.closingDate === NEXT_CYCLE);

/* Clock-derived, so it starts null and fills on mount or SSR and the browser disagree
   (DESIGN-SYSTEM §5.8). Ticks every second because this hero carries the H/M/S strip. */
type Left = { days: number; hours: number; minutes: number; seconds: number; finalDay: boolean };

function useCountdown(iso: string): Left | null {
  const [left, setLeft] = useState<Left | null>(null);
  useEffect(() => {
    const compute = (): Left => {
      const ms = remainingMs(iso);
      return {
        days: daysLeft(iso),
        hours: Math.floor((ms % MS_DAY) / 3_600_000),
        minutes: Math.floor((ms % 3_600_000) / 60_000),
        seconds: Math.floor((ms % 60_000) / 1000),
        finalDay: isFinalDay(iso),
      };
    };
    setLeft(compute());
    const id = window.setInterval(() => setLeft(compute()), 1000);
    return () => window.clearInterval(id);
  }, [iso]);
  return left;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function HomePage() {
  const left = useCountdown(NEXT_CYCLE);
  const close = ordinalDateParts(NEXT_CYCLE);
  const finalDay = Boolean(left) && left!.finalDay;

  /* DAYS LEAD (founder, via his father, 30 Jul — DESIGN-SYSTEM §3d). Bryan's reference
     shows DAYS / HRS / MINS / SECS as four equal cells; that exact treatment is the one
     the founder ruled out, because a ticking seconds column beside a three-digit day
     count advertises that nothing is happening. This is the approved compromise already
     running on /tender: the SAME two readings, RANKED — the day count is the headline
     and the H/M/S strip sits under it, smaller and aria-hidden. */
  const countValue = !left ? " " : finalDay ? `${left.hours}` : left.days.toLocaleString("en-MY");
  const countUnit = !left
    ? " "
    : finalDay
      ? "hours left"
      : left.days === 1
        ? "day left"
        : "days left";
  const countLabel = !left
    ? `Offers close ${close.day} ${close.month} ${close.year}`
    : finalDay
      ? "Offers close today"
      : `${left.days} days until offers close`;

  const cells = [
    { k: "hrs", v: left ? pad2(left.hours) : "—" },
    { k: "mins", v: left ? pad2(left.minutes) : "—" },
    { k: "secs", v: left ? pad2(left.seconds) : "—" },
  ];

  return (
    <div className="home">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="hp-hero" aria-labelledby="hp-title">
          {/* ── LEFT ~45% · paper ────────────────────────────────────────────── */}
          <div className="hp-panel hp-panel-left">
            <div className="hp-panel-inner">
              <p className="hp-pill">Malaysia&rsquo;s E-Tender platform</p>
              <h1 id="hp-title">
                The smarter way to <em>buy property.</em>
              </h1>
              <p className="hp-lede">
                E-Tender is a private, deadline-based way to buy. Every listing carries a reserve
                price as a guide — you decide what to offer.
              </p>
              <div className="hp-act">
                <Link className="btn red" to="/tender">
                  Discover properties open for E-Tender
                </Link>
                <Link className="hp-out" to="/how-e-tender-works">
                  How E-Tender works
                </Link>
              </div>
              <p className="hp-assure">Private offers. No bidding. One closing date.</p>
              <p className="hp-seller">
                Selling a property?{" "}
                <Link className="hp-out" to="/sell">
                  See how E-Tender works for owners
                </Link>
              </p>
            </div>
          </div>

          {/* ── RIGHT ~55% · KL image under the maroon fade ───────────────────── */}
          <div className="hp-panel hp-panel-right">
            <div className="hp-panel-inner">
              <p className="hp-cycle-kick">Current E-Tender cycle</p>
              <p className="hp-cycle-lab">Offers close in</p>
              <p className="hp-cycle-count" aria-label={countLabel}>
                <span className="hp-cycle-n" aria-hidden="true">
                  {countValue}
                </span>
                <span className="hp-cycle-u" aria-hidden="true">
                  {countUnit}
                </span>
              </p>
              <ul className="hp-clock" aria-hidden="true">
                {cells.map((c) => (
                  <li key={c.k}>
                    <span className="v">{c.v}</span>
                    <span className="k">{c.k}</span>
                  </li>
                ))}
              </ul>
              <p className="hp-cycle-date">
                Next closing date
                <b>
                  {close.day}
                  <sup>{close.suffix}</sup> {close.month} {close.year}
                </b>
              </p>
              {/* Same destination as the primary CTA on the left — deliberate, from the
                  reference, and flagged for the audit rather than decided here. */}
              <Link className="hp-ghost" to="/tender">
                View all {IN_CYCLE.length} open E-Tenders in this cycle
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
