import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Journey } from "@/components/home/Journey";
import { ScrollCue } from "@/components/home/ScrollCue";
import { TwoWays } from "@/components/home/TwoWays";
import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { AUCTION_START_MS, OWNER_AUCTION } from "@/data/owner-auction";
import { TENDERS } from "@/data/tenders";
import {
  daysLeft,
  daysUntil,
  MS_DAY,
  ordinalDateParts,
  remainingMs,
  remainingMsUntil,
} from "@/lib/tender-utils";
import "@/styles/tender-listings.css";
import "@/styles/home.css";
import "@/styles/home-scrollcue.css";
import "@/styles/home-twoways.css";
import "@/styles/home-journey.css";

export const Route = createFileRoute("/")({ component: HomePage });

const NEXT_TENDER_DATE = TENDERS.map((tender) => tender.closingDate).sort()[0];
const TENDER_DATE = ordinalDateParts(NEXT_TENDER_DATE);
const AUCTION_DATE = ordinalDateParts(OWNER_AUCTION.date);

type EventCountdown = {
  days: number | null;
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
};

type HeroCountdowns = { tender: EventCountdown; auction: EventCountdown };

const EMPTY_COUNTDOWN: EventCountdown = {
  days: null,
  hours: null,
  minutes: null,
  seconds: null,
};

function clockParts(milliseconds: number) {
  return {
    hours: Math.floor((milliseconds % MS_DAY) / 3_600_000),
    minutes: Math.floor((milliseconds % 3_600_000) / 60_000),
    seconds: Math.floor((milliseconds % 60_000) / 1_000),
  };
}

function useHeroCountdowns(): HeroCountdowns {
  const [remaining, setRemaining] = useState<HeroCountdowns>({
    tender: EMPTY_COUNTDOWN,
    auction: EMPTY_COUNTDOWN,
  });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const tenderMilliseconds = remainingMs(NEXT_TENDER_DATE, now);
      const auctionMilliseconds = remainingMsUntil(AUCTION_START_MS, now);

      setRemaining({
        tender: {
          days: daysLeft(NEXT_TENDER_DATE, now),
          ...clockParts(tenderMilliseconds),
        },
        auction: {
          days: daysUntil(AUCTION_START_MS, now),
          ...clockParts(auctionMilliseconds),
        },
      });
    };

    update();
    const id = window.setInterval(update, 1_000);
    return () => window.clearInterval(id);
  }, []);

  return remaining;
}

const pad2 = (value: number | null) => (value === null ? "--" : String(value).padStart(2, "0"));

function CountdownClock({ countdown, label }: { countdown: EventCountdown; label: string }) {
  /* DAYS LEAD, H:M:S SUPPORTS. The day count stays the anchor — Bryan's father,
     30 Jul: what a buyer cares about is how many days are left. The clock sits
     under it as a second tier rather than being fused into one casino-style
     `122 : 07 : 14 : 32` run.

     No `aria-live` anywhere here, deliberately: the visual clock repaints every
     second and announcing that every second would make the page unusable with a
     screen reader. The visual block is aria-hidden and this one static line —
     days and hours, no seconds — carries the meaning instead. */
  const accessibleCountdown =
    countdown.days === null
      ? "Countdown loading"
      : `${countdown.days} ${countdown.days === 1 ? "day" : "days"} and ${countdown.hours} ${
          countdown.hours === 1 ? "hour" : "hours"
        } left`;

  return (
    <>
      <span className="sr-only">{accessibleCountdown}</span>
      {/* `1fr auto 1fr`: eyebrow, numeral and DAYS LEFT share the centre
          column, the tick hangs off the numeral's BASELINE in column three.
          The numeral only drifts off-centre by (col3 - col1)/2, so the tick
          MUST stay narrow enough that column three does not eat column one —
          at 26px it measured 250px against 442px of content, column one
          collapsed to zero and the numeral was pinned to the left edge. Keep
          it near 120px and the numeral sits within ~10px of true centre. */}
      <div className="hp-product-clock" aria-hidden="true">
        <p className="hp-product-status">{label}</p>
        <b>{countdown.days ?? "\u00a0"}</b>
        <span className="hp-tick">
          {(
            [
              ["h", countdown.hours],
              ["m", countdown.minutes],
              ["s", countdown.seconds],
            ] as const
          ).map(([unit, value]) => (
            <span className="hp-tick-cell" key={unit}>
              <span className="hp-tick-value">{pad2(value)}</span>
              <span className="hp-tick-unit">{unit}</span>
            </span>
          ))}
        </span>
        <i>{countdown.days === 1 ? "day left" : "days left"}</i>
      </div>
    </>
  );
}

function EventDate({
  date,
  dateTime,
}: {
  date: ReturnType<typeof ordinalDateParts>;
  dateTime: string;
}) {
  return (
    <time dateTime={dateTime}>
      {date.day}
      <sup>{date.suffix}</sup> {date.month} {date.year}
    </time>
  );
}

function HomePage() {
  const remaining = useHeroCountdowns();

  return (
    <div className="home">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="hp-hero" aria-labelledby="hp-title">
          <img
            className="hp-hero-image"
            src="/assets/layout/home-hero-panorama-v2.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
          <div className="hp-hero-wash" aria-hidden="true" />

          <div className="hp-hero-inner">
            <p className="hp-eyebrow">Malaysia&rsquo;s No.1 Property E-Bidding Platform</p>
            <h1 id="hp-title" className="hp-title">
              <span className="hp-title-line hp-title-primary">Find a property.</span>{" "}
              <span className="hp-title-line hp-title-secondary">
                Choose how you <em className="hp-title-buy">buy</em> or{" "}
                <em className="hp-title-sell">sell</em> it.
              </span>
            </h1>

            <div className="hp-products">
              <span className="hp-products-seam" aria-hidden="true" />

              <article className="hp-product hp-product-tender">
                <h2 className="hp-product-name">E-Tender</h2>
                <div className="hp-product-event">
                  <CountdownClock countdown={remaining.tender} label="E-Tender closes in" />
                  <span className="hp-product-rule" aria-hidden="true" />
                  {/* Date only — an E-Tender runs to the end of its closing day,
                      so the 11:59 PM time adds nothing here. */}
                  <p className="hp-product-date">
                    <EventDate date={TENDER_DATE} dateTime={NEXT_TENDER_DATE} />
                  </p>
                </div>
                <p className="hp-product-note">Name your price in a private sealed offer.</p>
                <Link className="hp-product-link" to="/tender" search={{ q: undefined }}>
                  <span>View E-Tender Listings</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </article>

              <article className="hp-product hp-product-auction">
                <h2 className="hp-product-name">Owner Auction</h2>
                <div className="hp-product-event">
                  <CountdownClock countdown={remaining.auction} label="Next Owner Auction in" />
                  <span className="hp-product-rule" aria-hidden="true" />
                  {/* Date only, matching E-Tender. The exact 9:00 AM start used to
                      print here; removing it makes the two halves identical in
                      content, so every row lines up across the seam. */}
                  <p className="hp-product-date">
                    <EventDate
                      date={AUCTION_DATE}
                      dateTime={`${OWNER_AUCTION.date}T${OWNER_AUCTION.time24}+08:00`}
                    />
                  </p>
                </div>
                <p className="hp-product-note">Bid live online on auction day.</p>
                <Link className="hp-product-link" to="/owner-auction" search={{ q: undefined }}>
                  <span>View Owner Auction Listings</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </article>
            </div>

            {/* Last item in the hero's own flow. Secondary to the two listing
                CTAs above it — the education path, not an action. */}
            <ScrollCue />
          </div>
        </section>

        <TwoWays />
        <Journey />
      </main>
      <SiteFooter />
    </div>
  );
}
