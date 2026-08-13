import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { HomeSearch } from "@/components/home/HomeSearch";
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
  /* DAYS ONLY. Bryan's father, 30 Jul: what a buyer cares about is how many
     days are left, not the timer — a seconds column beside a three-digit day
     count "advertises that nothing is happening". Two of them side by side
     also ticked a second out of step with each other, which reads as broken. */
  const accessibleCountdown =
    countdown.days === null ? "Countdown loading" : `${countdown.days} days left`;

  return (
    <>
      <span className="sr-only">{accessibleCountdown}</span>
      <div className="hp-product-clock" aria-hidden="true">
        <strong>{countdown.days ?? "\u00a0"}</strong>
        <span>{countdown.days === 1 ? "day" : "days"}</span>
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
            <p className="hp-eyebrow">Malaysia&rsquo;s E-Tender &amp; Owner Auction Platform</p>
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
                <p className="hp-product-what">Sealed offers &mdash; you name the price</p>
                <div className="hp-product-event">
                  <p className="hp-product-status">E-Tender closes in</p>
                  <CountdownClock countdown={remaining.tender} />
                  <p className="hp-product-date">
                    <EventDate date={TENDER_DATE} dateTime={NEXT_TENDER_DATE} />
                    <span>11:59 PM MYT</span>
                  </p>
                </div>
              </article>

              <article className="hp-product hp-product-auction">
                <h2 className="hp-product-name">Owner Auction</h2>
                <p className="hp-product-what">Live bidding on auction day</p>
                <div className="hp-product-event">
                  <p className="hp-product-status">Next Owner Auction in</p>
                  <CountdownClock countdown={remaining.auction} />
                  <p className="hp-product-date">
                    <EventDate
                      date={AUCTION_DATE}
                      dateTime={`${OWNER_AUCTION.date}T${OWNER_AUCTION.time24}+08:00`}
                    />
                    <span>
                      {OWNER_AUCTION.timeLabel} {OWNER_AUCTION.timezone}
                    </span>
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Straddles the seam — pulled up over the hero by `--hs-overlap`. With
            the scroll cue gone this card IS the signal that the page continues,
            and the only action at the fold. */}
        <HomeSearch />

        <TwoWays />
      </main>
      <SiteFooter />
    </div>
  );
}
