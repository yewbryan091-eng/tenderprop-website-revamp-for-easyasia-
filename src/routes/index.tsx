import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { HomeSearch } from "@/components/home/HomeSearch";
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
import "@/styles/home-search.css";
import "@/styles/home-twoways.css";

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

function CountdownClock({ countdown }: { countdown: EventCountdown }) {
  const units = [
    { value: countdown.hours, label: "H" },
    { value: countdown.minutes, label: "M" },
    { value: countdown.seconds, label: "S" },
  ];
  const accessibleCountdown =
    countdown.days === null
      ? "Countdown loading"
      : `${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes and ${countdown.seconds} seconds`;

  return (
    <>
      <span className="sr-only">{accessibleCountdown}</span>
      <div className="hp-product-clock" aria-hidden="true">
        <div className="hp-product-day-stack">
          <strong>{countdown.days ?? "\u00a0"}</strong>
          <span>{countdown.days === 1 ? "day left" : "days left"}</span>
        </div>
        <div className="hp-product-tick">
          {units.map((unit) => (
            <span className="hp-product-tick-unit" key={unit.label}>
              <b>{unit.value === null ? "\u00a0\u00a0" : String(unit.value).padStart(2, "0")}</b>
              <small>{unit.label}</small>
            </span>
          ))}
        </div>
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
            <h1 id="hp-title" className="hp-title">
              <span className="hp-title-line hp-title-primary">Find a property.</span>{" "}
              <span className="hp-title-line hp-title-secondary">
                Choose how you <em className="hp-title-buy">buy</em> and{" "}
                <em className="hp-title-sell">sell</em> it.
              </span>
            </h1>

            <div className="hp-products">
              <span className="hp-products-seam" aria-hidden="true" />

              <article className="hp-product hp-product-tender">
                <h2 className="hp-product-name">E-Tender</h2>
                <div className="hp-product-event">
                  <p className="hp-product-status">E-Tender closes in</p>
                  <CountdownClock countdown={remaining.tender} />
                  <span className="hp-product-divider" aria-hidden="true" />
                  <p className="hp-product-date">
                    <EventDate date={TENDER_DATE} dateTime={NEXT_TENDER_DATE} />
                  </p>
                </div>
                <Link className="hp-product-link" to="/tender" aria-label="Go to E-Tender listings">
                  <span>Go to listings</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </article>

              <article className="hp-product hp-product-auction">
                <h2 className="hp-product-name">Owner Auction</h2>
                <div className="hp-product-event">
                  <p className="hp-product-status">Next Owner Auction in</p>
                  <CountdownClock countdown={remaining.auction} />
                  <span className="hp-product-divider" aria-hidden="true" />
                  <p className="hp-product-date hp-product-date-auction">
                    <EventDate
                      date={AUCTION_DATE}
                      dateTime={`${OWNER_AUCTION.date}T${OWNER_AUCTION.time24}+08:00`}
                    />
                    <span>
                      {OWNER_AUCTION.timeLabel} {OWNER_AUCTION.timezone}
                    </span>
                  </p>
                </div>
                <Link
                  className="hp-product-link"
                  to="/owner-auction"
                  aria-label="Go to Owner Auction listings"
                >
                  <span>Go to listings</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </div>
          </div>

          {/* Foot of the fold — sits under the product panel once it lands, and
              is positioned against the hero so it stays out of its layout. */}
          <ScrollCue />
        </section>

        {/* Straddles the seam — pulled up over the hero by `--hs-overlap`. */}
        <HomeSearch />

        <TwoWays />
      </main>
      <SiteFooter />
    </div>
  );
}
