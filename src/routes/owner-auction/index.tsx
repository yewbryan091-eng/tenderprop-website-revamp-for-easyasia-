import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { TENDERS } from "@/data/tenders";
import { MS_DAY, daysLeft, isFinalDay, remainingMs } from "@/lib/tender-utils";
import "@/styles/tender-listings.css";

/* ── OWNER AUCTION — step 1: the /tender hero, duplicated verbatim ─────────────
   Bryan, 6 Aug: strip the page back to nothing and copy the E-Tender hero across
   as-is; refine afterwards. So this is deliberately a straight lift — the same
   `.hero-tender` markup, the same CSS (that file's hero rules are unscoped, so
   they apply here untouched and NOTHING in tender-listings.css needed editing),
   and the same countdown maths.

   ⚠️ EVERYTHING BELOW IS STILL E-TENDER'S, ON PURPOSE, PENDING REFINEMENT:
     · the copy — "Offers close in", "Next e-tender cycle", "New to E-Tender?",
       the three steps, and the CTA to /how-e-tender-works
     · the date — the earliest E-Tender closing date, because there is no Owner
       Auction data in the repo at all (zero records, no auctionTime, no
       auctioneer). See the plan in TEAM-LOG.
     · the countdown — `remainingMs` resolves to 23:59:59 MYT, which is right for
       a tender that runs to end of day and WRONG for an auction that starts at a
       set time. It must not survive refinement unchanged.
   The old PageShell scaffold (five dashed frames) is gone with this. */

export const Route = createFileRoute("/owner-auction/")({ component: OwnerAuction });

/* Same derivation as /tender, and the same placeholder problem: this is the next
   E-TENDER closing date, not an auction date. Replaced when auction data exists. */
const NEXT_DATE = TENDERS.map((t) => t.closingDate).sort()[0];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const HERO_DATE = (() => {
  const [year, month, day] = NEXT_DATE.split("-").map(Number);
  const lastTwo = day % 100;
  const suffix =
    lastTwo >= 11 && lastTwo <= 13
      ? "th"
      : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] || "th";
  return { day, suffix, month: MONTH_NAMES[month - 1], year };
})();

/* Null until mount so SSR and first paint never show a flash of zeros. */
type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finalDay: boolean;
};

function useCountdown(iso: string): Remaining | null {
  const [left, setLeft] = useState<Remaining | null>(null);
  useEffect(() => {
    const compute = (): Remaining => {
      const ms = remainingMs(iso);
      return {
        days: daysLeft(iso),
        hours: Math.floor((ms % MS_DAY) / 3600000),
        minutes: Math.floor((ms % 3600000) / 60000),
        seconds: Math.floor((ms % 60000) / 1000),
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

function OwnerAuction() {
  const left = useCountdown(NEXT_DATE);
  const timerUnits = [
    { label: "d", value: left ? String(left.days) : "" },
    { label: "h", value: left ? pad2(left.hours) : "" },
    { label: "m", value: left ? pad2(left.minutes) : "" },
    { label: "s", value: left ? pad2(left.seconds) : "" },
  ];
  const FINAL_DAY = Boolean(left) && left!.finalDay;
  const countdownValue = !left
    ? " "
    : FINAL_DAY
      ? `${left.hours}h ${pad2(left.minutes)}m`
      : left.days.toLocaleString("en-MY");
  const countdownUnit = !left
    ? ""
    : FINAL_DAY
      ? "left today"
      : left.days === 1
        ? "day left"
        : "days left";
  const countdownLabel = !left
    ? "Offers close soon"
    : FINAL_DAY
      ? `Offers close in ${left.hours} hours and ${left.minutes} minutes`
      : `Offers close in ${left.days} ${left.days === 1 ? "day" : "days"}`;

  return (
    <div className="tp-listings">
      <SiteHeader />

      <main>
        {/* HERO — full-bleed diagonal split, lifted from /tender unchanged. */}
        <section className="hero-tender" aria-label="Owner Auction overview">
          <div className="hero-panel hero-panel-left is-dark">
            <div className="hero-panel-inner">
              <div className="hero-timer" aria-live="off" aria-label={countdownLabel}>
                <span className="hero-timer-heading" aria-hidden="true">
                  <span className="hero-timer-label">Offers close in</span>
                </span>
                <span className="hero-timer-days" aria-hidden="true">
                  <span className="hero-timer-value">{countdownValue}</span>
                  {left && !FINAL_DAY && (
                    <span className="hero-tick">
                      {timerUnits.slice(1).map((u) => (
                        <span className="hero-tick-cell" key={u.label}>
                          <span className="hero-tick-value">{u.value}</span>
                          <span className="hero-tick-unit">{u.label}</span>
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="hero-timer-unit">{countdownUnit}</span>
                </span>
              </div>
              <p className="hero-eyebrow">Next e-tender cycle</p>
              <p className="hero-date">
                <time dateTime={NEXT_DATE}>
                  {HERO_DATE.day}
                  <sup>{HERO_DATE.suffix}</sup> {HERO_DATE.month} {HERO_DATE.year}
                </time>
              </p>
              <p className="hero-foot">Offers close at the end of the closing date</p>
            </div>
          </div>

          <div className="hero-panel hero-panel-right">
            <div className="hero-panel-inner">
              <p className="hero-eyebrow">New to E-Tender?</p>
              <h2 className="hero-steps-head">
                <span>E-Tender in</span>
                <span>
                  <em>3 simple steps.</em>
                </span>
              </h2>
              <ol className="hero-steps" aria-label="How E-Tender works, in three steps">
                <li>
                  <p className="hero-step-head">Find</p>
                  <p className="hero-step-body">
                    Browse properties open for E-Tender and choose one you&rsquo;re interested in.
                  </p>
                </li>
                <li>
                  <p className="hero-step-head">Offer</p>
                  <p className="hero-step-body">
                    Submit your price privately before the E-Tender closes.
                  </p>
                </li>
                <li>
                  <p className="hero-step-head">Connect</p>
                  <p className="hero-step-body">
                    The property listing agent follows up with you on viewing, your offer and the
                    next steps.
                  </p>
                </li>
              </ol>
              <a className="hero-steps-cta" href="/how-e-tender-works">
                <span className="hero-steps-cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </span>
                <span className="hero-steps-cta-label">See how E-Tender works</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
