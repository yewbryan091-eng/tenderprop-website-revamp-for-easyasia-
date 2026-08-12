import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import {
  AUCTION_HERO_DATE,
  AUCTION_TIME_LABEL,
  OWNER_AUCTION,
  REGISTRATION_DATE,
} from "@/data/owner-auction";
import { TENDERS } from "@/data/tenders";
import { MS_DAY, daysLeft, isFinalDay, ordinalDateParts, remainingMs } from "@/lib/tender-utils";
import "@/styles/tender-listings.css";
import "@/styles/home.css";

export const Route = createFileRoute("/")({ component: HomePage });

/* HOMEPAGE HERO — full-background product gateway, 12 Aug 2026.

   Bryan's father rejected the diagonal treatment: the homepage needs to feel like the
   full entrance to TenderProp, not an E-Tender campaign page. The replacement makes the
   platform's TWO buying methods the only interaction split. Behind them, three Malaysian
   property scenes form one market panorama: urban skyline, everyday residential stock,
   and a landed home.

   The rendered comparison favoured a 23/54/23 crop: the centre reads as one dominant
   property canvas while the side scenes add breadth without competing with the headline. */

/* Real listings only — demo records are fabricated state-coverage fillers and must never
   make a platform-level inventory count look larger than it is. */
const REAL = TENDERS.filter((t) => !t.demo);
const NEXT_CYCLE = REAL.map((t) => t.closingDate).sort()[0];
const IN_CYCLE = REAL.filter((t) => t.closingDate === NEXT_CYCLE);

type Left = { days: number; hours: number; minutes: number; seconds: number; finalDay: boolean };

/* Both homepage countdowns target an end-of-day Malaysian deadline: E-Tender closing,
   and Owner Auction registration closing. Keeping them on the same utility path prevents
   the old SSR/timezone/rounding disagreement from returning in a new component. */
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

function EventCountdown({ left, label }: { left: Left | null; label: string }) {
  const value = !left ? " " : left.finalDay ? `${left.hours}h ${pad2(left.minutes)}m` : left.days;
  const unit = !left
    ? " "
    : left.finalDay
      ? "left today"
      : left.days === 1
        ? "day left"
        : "days left";

  const spoken = !left
    ? label
    : left.finalDay
      ? `${label}: ${left.hours} hours and ${left.minutes} minutes left today`
      : `${label}: ${left.days} ${left.days === 1 ? "day" : "days"} left`;

  return (
    <div className="hp-deadline" aria-label={spoken}>
      <p className="hp-deadline-label" aria-hidden="true">
        {label}
      </p>
      <p className="hp-deadline-value" aria-hidden="true">
        <span>{value}</span>
        <small>{unit}</small>
      </p>
      {left && !left.finalDay && (
        <ul className="hp-mini-clock" aria-hidden="true">
          <li>
            <b>{pad2(left.hours)}</b>
            <span>hrs</span>
          </li>
          <li>
            <b>{pad2(left.minutes)}</b>
            <span>mins</span>
          </li>
          <li>
            <b>{pad2(left.seconds)}</b>
            <span>secs</span>
          </li>
        </ul>
      )}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

function HomePage() {
  const tenderLeft = useCountdown(NEXT_CYCLE);
  const registrationLeft = useCountdown(OWNER_AUCTION.registrationClosesDate);
  const tenderClose = ordinalDateParts(NEXT_CYCLE);

  return (
    <div className="home">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="hp-hero" aria-labelledby="hp-title">
          <div className="hp-scenes" aria-hidden="true">
            <div className="hp-scene hp-scene-city" />
            <div className="hp-scene hp-scene-market" />
            <div className="hp-scene hp-scene-home" />
          </div>
          <div className="hp-hero-wash" aria-hidden="true" />

          <div className="hp-hero-inner">
            <header className="hp-thesis">
              <p className="hp-kicker">Malaysia&rsquo;s E-Tender &amp; Owner Auction platform</p>
              <h1 id="hp-title">Choose how you want to buy property.</h1>
              <p>
                Submit your price privately through E-Tender, or register and bid through Owner
                Auction.
              </p>
            </header>

            <div className="hp-products">
              <article className="hp-product hp-product-tender">
                <div className="hp-product-copy">
                  <p className="hp-product-kicker">Private sealed offer</p>
                  <h2>E-Tender</h2>
                  <p>Choose your price. Your offer stays private.</p>
                </div>
                <EventCountdown left={tenderLeft} label="Offers close in" />
                <p className="hp-event-date">
                  Next closing date
                  <time dateTime={NEXT_CYCLE}>
                    {tenderClose.day}
                    <sup>{tenderClose.suffix}</sup> {tenderClose.month} {tenderClose.year}
                  </time>
                </p>
                <Link className="hp-product-link" to="/tender">
                  Explore {IN_CYCLE.length} open E-Tenders
                  <ArrowIcon />
                </Link>
              </article>

              <article className="hp-product hp-product-auction">
                <div className="hp-product-copy">
                  <p className="hp-product-kicker">Live competitive bidding</p>
                  <h2>Owner Auction</h2>
                  <p>Register first, then bid live on auction day.</p>
                </div>
                <EventCountdown left={registrationLeft} label="Registration closes in" />
                <p className="hp-event-date">
                  Auction date
                  <time dateTime={`${OWNER_AUCTION.date}T${OWNER_AUCTION.time24}+08:00`}>
                    {AUCTION_HERO_DATE.day}
                    <sup>{AUCTION_HERO_DATE.suffix}</sup> {AUCTION_HERO_DATE.month}{" "}
                    {AUCTION_HERO_DATE.year} · {AUCTION_TIME_LABEL}
                  </time>
                  <span className="sr-only">
                    Registration closes {REGISTRATION_DATE.day}
                    {REGISTRATION_DATE.suffix} {REGISTRATION_DATE.month} {REGISTRATION_DATE.year}
                  </span>
                </p>
                <Link className="hp-product-link" to="/owner-auction">
                  Explore Owner Auctions
                  <ArrowIcon />
                </Link>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
