import { useEffect, useState } from "react";

import { TENDERS } from "@/data/tenders";
import { initDetailPage } from "@/lib/tender-detail-behaviour";
import { AGENT_PHOTO, PROJECT_IMG, SINARAN_PHOTOS } from "@/lib/images";
import { depositOf, fmtDate } from "@/lib/tender-utils";
import "@/styles/tender-detail.css";

/* Ported 1:1 from residensi-sinaran-detail.html — the design canon.
   Class names and DOM ids are unchanged so EasyAsia can lift the markup. */

const SINARAN_TENDER = TENDERS.find((tender) => tender.name === "Residensi Sinaran");
if (!SINARAN_TENDER) throw new Error("Residensi Sinaran tender data is missing");

/* Single source of truth for this listing's reserve, deposit and tender close. */
const TENDER_CLOSE_ISO = `${SINARAN_TENDER.closingDate}T23:59:59+08:00`;
const TENDER_CLOSE_LABEL = fmtDate(SINARAN_TENDER.closingDate);

/* The payment ladder is derived, never typed. Founder-confirmed 30 Jul 2026: the 3%
   tender deposit is the Malaysian earnest deposit — the first slice of the standard
   10% down payment, not a separate platform charge. Balance to 10% falls due at SPA,
   the remaining 90% on completion. */
const RESERVE = SINARAN_TENDER.reservePrice;
const DEPOSIT = depositOf(SINARAN_TENDER);
const rm = (n: number) => "RM" + Math.round(n).toLocaleString("en-MY");
/* Reserve price per square foot — DERIVED, never typed. This is the number a buyer
   actually compares properties on and decides an offer with, and no Malaysian portal
   leads with it. Parsed from the built-up string so it stays true if either changes. */
const BUILT_UP_SQFT = Number((SINARAN_TENDER.builtUp || "").replace(/[^0-9.]/g, "")) || 0;
const PSF = BUILT_UP_SQFT ? Math.round(RESERVE / BUILT_UP_SQFT) : 0;
const PRICE_BASIS = SINARAN_TENDER.builtUp.replace(/\s*sqft\b/i, " sq ft");
const TITLE_TYPE = "Strata title";
const LAND_USE = SINARAN_TENDER.details?.landTitle;
if (!LAND_USE) throw new Error("Residensi Sinaran land-use data is missing");

/* PROPERTY DETAILS — one flat label/value list, rendered two-up: exactly the shape an
   admin form produces (type a label, type a value, save). Add, remove or reorder rows
   here and the layout follows; nothing below is written per-field. When EasyAsia wires a
   CMS, this array is what it replaces.

   NOTHING IN HERE IS ALREADY SHOWN ELSEWHERE ON THE PAGE. Removed as duplicates: tenure,
   lease expiry, title type and land use (the pricing heading above); bedrooms, bathrooms,
   built-up, storeys and car parks (the icon band, which now reads straight off the tender
   record); property type (the page header's address line). A spec sheet that repeats the
   summary above it is just noise.

   Fields are the ones a Malaysian subsale buyer actually gets from a land search and a
   listing sheet — title particulars (category of land use, restriction in interest,
   encumbrances), the annual carrying costs, and development facts. Values marked (iNP)
   are real, from iNewProject's own Project Details for this development. Note: Sinaran is
   STRATA in Selangor, so its annual land tax is PARCEL rent, not quit rent — Selangor
   moved stratified property onto parcel rent. Anything genuinely unknown is NOT here; it
   belongs in NOT_DISCLOSED so this table never carries a blank. */
const PROPERTY_DETAILS: { label: string; value: string }[] = [
  { label: "Unit position",           value: "Intermediate lot" },
  { label: "Land area",               value: "22\u2032 \u00d7 78\u2032 (1,716 sqft)" }, // (iNP), unit corrected
  { label: "Restrictions",            value: "Nil" },
  { label: "Encumbrance",             value: "Free of encumbrances" },
  { label: "Bumi lot",                value: "No" },
  { label: "Parcel rent",             value: "RM480 / year" },
  { label: "Assessment tax",          value: "RM620 / year" },
  { label: "Renovation",              value: "Original developer condition" },
  { label: "Gated & guarded",         value: "Yes \u00b7 single controlled access" },
  { label: "Year completed",          value: "2025" },                            // (iNP)
  { label: "Developer",               value: "SEGA Land Development Sdn Bhd" },    // (iNP)
  { label: "Total units",             value: "62 units" },                        // (iNP)
  { label: "Development phase",       value: "Phase 4 of 4" },                    // (iNP)
  { label: "Sale type",               value: "Subsale" },
  { label: "Listing reference",       value: "TP-SNR-0417" },
];


/* The icon band reads STRAIGHT OFF the tender record — the same source the listing cards
   use — so it can never drift from the data, and it no longer needs those five facts
   duplicated into PROPERTY_DETAILS. A slot with no value in the record does not render. */
type BandItem = { label: string; value: string; path: string };
const BAND: BandItem[] = ([
  ["Bedrooms",      SINARAN_TENDER.bedrooms,  "M3 18v-6h18v6M3 12V7M21 12v-1a3 3 0 0 0-3-3h-4v4M3 18v2M21 18v2"],
  ["Bathrooms",     SINARAN_TENDER.bathrooms, "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2"],
  ["Built-up area", SINARAN_TENDER.builtUp,   "M4 4h16v16H4zM4 9h5M15 20v-5M9 4v5M15 4v5M4 15h5M15 15h5"],
  ["Storeys",       SINARAN_TENDER.storeys,   "M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5"],
  ["Car parks",     SINARAN_TENDER.carParks,  "M5 17h14M4 17v-4l2-5h12l2 5v4M4 17v2h2v-2M18 17v2h2v-2"],
] as [string, string | number | null | undefined, string][])
  .filter(([, v]) => v !== null && v !== undefined && v !== "")
  .map(([label, v, path]) => ({ label, value: String(v), path }));

export function ResidensiSinaranDetail() {
  useEffect(() => initDetailPage(), []);

  /* Days remaining is computed, never hand-typed. Starts neutral so SSR and a
     Malaysian browser can't disagree on the day count during hydration. */
  const [daysLabel, setDaysLabel] = useState<string | null>(null);
  /* Live countdown for the tender rail — same segmented D:H:M:S language as the
     grid hero, so both pages tell time the same way. Null until mount (SSR-safe). */
  const [cd, setCd] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  /* Below this many days the segmented D:H:M:S clock earns its place; above it the
     seconds are noise and the plain day count reads as confidence, not theatre. */
  const CLOCK_FROM_DAYS = 90;
  const showClock = cd !== null && cd.d < CLOCK_FROM_DAYS;
  useEffect(() => {
    const calc = () => {
      const diff = new Date(TENDER_CLOSE_ISO).getTime() - Date.now();
      const days = Math.max(0, Math.ceil(diff / 86400000));
      setDaysLabel(days <= 0 ? "Closed" : days.toLocaleString("en-MY") + (days === 1 ? " day left" : " days left"));
      let ms = Math.max(0, diff);
      const d = Math.floor(ms / 86400000); ms -= d * 86400000;
      const h = Math.floor(ms / 3600000); ms -= h * 3600000;
      const m = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      setCd({ d, h, m, s: sec });
    };
    calc();
    const id = window.setInterval(calc, 1000); /* 1s: only meaningful inside CLOCK_FROM_DAYS, harmless outside */
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="tp-detail">
      <main>

        {/* The overview runs wider than the reading column below it (per Bryan's
            iNewProject reference). Photos want width; body copy wants ~70ch. The
            title row widens with the gallery — left at the old width it read as a
            caption floating away from its own photos. */}
        <section className="overview" id="overview">
          <div className="wrap wrap-wide">
            <div className="crumbs"><a href="#">Home</a> / <a href="/tender">Tender</a> / Residensi Sinaran</div>
            <div className="ovhead">
              <div className="ovtitle">
                {/* Tender state above the fold. Without this the detail page told the
                    buyer LESS about the tender than the card they clicked to get here —
                    open/closed and the deadline sat below the whole gallery. */}
                <p className="ovstatus">
                  <span className="status"><span className="dot" aria-hidden="true" />Open for tender</span>
                  <span className="ovcloses">Closes {TENDER_CLOSE_LABEL}{daysLabel ? " · " + daysLabel : ""}</span>
                </p>
                <h1>Residensi Sinaran</h1>
                <p className="addr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 21s-7-5.6-7-11a7 7 0 0114 0c0 5.4-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Taman Sri Muda, Shah Alam, Selangor · 3-Storey Townhouse</p>
              </div>
              <div className="ovside">
                {/* "Reserve price" is auction vocabulary most subsale buyers have not met.
                    Say what it means right where the number is, or they read it as a fixed
                    asking price and the whole tender mechanic is misunderstood. */}
                <div className="ovprice"><div className="k">Reserve Price</div><div className="v num">RM517,000</div><div className="s">The floor — offers start here</div></div>
                <div className="actions">
                  <button type="button" className="icobtn" id="save-btn" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 20.5l-1.4-1.3C5.4 14.5 2 11.4 2 7.6 2 4.9 4.1 3 6.7 3c1.5 0 2.9.7 3.8 1.8L12 6.2l1.5-1.4C14.4 3.7 15.8 3 17.3 3 19.9 3 22 4.9 22 7.6c0 3.8-3.4 6.9-8.6 11.6L12 20.5z" /></svg><span>Save</span></button>
                  <button type="button" className="icobtn" id="share-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg><span>Share</span></button>
                  <a className="btn red" href="#">Apply for Tender</a>
                </div>
              </div>
            </div>

            <div className="gallery">
              <div className="stagebox" id="stagebox">
                <img id="stage-img" src={SINARAN_PHOTOS[0]} alt="Residensi Sinaran — main view" />
                <span className="stagecount" id="stagecount">1 / 7</span>
                <span className="zoomhint" id="zoomhint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" strokeLinecap="round" /></svg><span className="zoomhint-label">View all 7 photos</span></span>
              </div>
              <div className="thumbgrid" id="thumbs">
                <button type="button" className="thumb on" data-res="ph1"><img src={SINARAN_PHOTOS[0]} alt="Residensi Sinaran photo 1" /></button>
                <button type="button" className="thumb" data-res="ph2"><img src={SINARAN_PHOTOS[1]} alt="Residensi Sinaran photo 2" /></button>
                <button type="button" className="thumb" data-res="ph3"><img src={SINARAN_PHOTOS[2]} alt="Residensi Sinaran photo 3" /></button>
                <button type="button" className="thumb" data-res="ph4"><img src={SINARAN_PHOTOS[3]} alt="Residensi Sinaran photo 4" /></button>
                <button type="button" className="thumb" data-res="ph5"><img src={SINARAN_PHOTOS[4]} alt="Residensi Sinaran photo 5" /></button>
                <button type="button" className="thumb" data-res="ph6" data-rest="ph7"><img src={SINARAN_PHOTOS[5]} alt="Residensi Sinaran photo 6" /><span className="more">+1<small>View all photos</small></span></button>
              </div>
            </div>

            {/* Video and Drone buttons removed — no footage exists for this property.
                Restore the .mediarow buttons once real media is supplied. */}

          </div>
        </section>


        <nav className="subnav" id="subnav" aria-label="Section navigation">
          <div className="wrap">
            <div className="row"><a href="#tender">Tender Info</a> <a href="#details">Details</a> <a href="#about">About</a> <a href="#selling">Selling Points</a> <a href="#area">What's Nearby</a> <a href="#location">Location</a> <a href="#agent">Agent</a> <a href="#mortgage">Mortgage</a> <a href="#faq">FAQ</a></div>
          </div>
        </nav>


        <section className="blk" id="tender">
          <div className="wrap">
            <div className="v1">
              <div className="v1-top">
                <h3>Tender Information</h3>
              </div>

              <div className="v1-grid">
                <div className="v1-main">
                  <div className="v1-facts">
                    <div className="v1-price">
                      <span className="lbl">Reserve price</span>
                      <b className="num">{rm(RESERVE)}</b>
                      <span className="sub">Minimum offer considered</span>
                    </div>
                    <div>
                      <span className="lbl">Tender deposit</span>
                      <b className="dep-amt">{DEPOSIT}</b>
                      <span className="sub">Refundable &middot; part of your 10%</span>
                    </div>
                    <div>
                      <span className="lbl">Tender method</span>
                      <b>Sealed E-Tender</b>
                      <span className="sub">Your offer stays confidential</span>
                    </div>
                  </div>
                  <p className="v1-reassure">
                    <b>Not an extra charge.</b> Your 3% deposit counts toward the standard 10%
                    down payment, and is returned in full immediately if no sale proceeds.
                  </p>

                  <div className="v1-steps">
                    <div className="stepshead">How the tender works</div>
                    <ol>
                      <li>
                        <span className="n">1</span>
                        <div><b>Register and verify</b><p>Complete account verification before the registration deadline.</p></div>
                      </li>
                      <li>
                        <span className="n">2</span>
                        <div><b>Submit your tender</b><p>Send your sealed offer and review the deposit terms in your member account.</p></div>
                      </li>
                      <li>
                        <span className="n">3</span>
                        <div><b>The seller responds</b><p>Expect an acceptance, decline or counter within 5 working days of closing.</p></div>
                      </li>
                    </ol>
                    <p className="v1-negotiate">
                      <b>Three possible outcomes.</b> The seller may accept, decline or counter through
                      the appointed agent. The moment it is clear no sale will proceed, your deposit is
                      returned in full — immediately, not after a processing period.
                    </p>
                  </div>
                </div>

                <aside className="v1-rail" id="tender-action-panel">
                  <svg className="tp-clip tp-clip-back" viewBox="0 0 28 72" aria-hidden="true" focusable="false">
                    <path d="M9 48V16a5 5 0 0 1 10 0v40a8 8 0 0 1-16 0V12a7 7 0 0 1 7-7h2" />
                  </svg>
                  <svg className="tp-clip tp-clip-front" viewBox="0 0 28 72" aria-hidden="true" focusable="false">
                    <path d="M9 30v18" />
                  </svg>
                  <span className="v1-rail-kicker">Tender notice</span>
                  <div className="v1-register">
                    <span className="lbl">Register by</span>
                    <b>17 Dec 2028</b>
                    <span>Account verified by this date</span>
                  </div>
                  <div className="v1-deadline">
                    <span className="lbl">Tender closes</span>
                    <div className="v1-date">{TENDER_CLOSE_LABEL}</div>
                    <div
                      className="v1-timer"
                      role="timer"
                      aria-label="Time remaining until tender closes"
                      aria-live="off"
                    >
                      {showClock && cd ? (
                        <>
                          <span className="u"><b>{cd.d}</b><i>d</i></span>
                          <span className="sep">:</span>
                          <span className="u"><b>{String(cd.h).padStart(2, "0")}</b><i>h</i></span>
                          <span className="sep">:</span>
                          <span className="u"><b>{String(cd.m).padStart(2, "0")}</b><i>m</i></span>
                          <span className="sep">:</span>
                          <span className="u"><b>{String(cd.s).padStart(2, "0")}</b><i>s</i></span>
                        </>
                      ) : (
                        <span className="u v1-timer-days"><b>{daysLabel ?? "\u2014"}</b></span>
                      )}
                    </div>
                    <span className="v1-cd">Offers close at the end of this date</span>
                  </div>
                  <a className="btn-red" href="#">Apply for Tender</a>
                  <a className="btn-wa" href="https://wa.me/60123938255" target="_blank" rel="noopener">
                    Ask the agent on WhatsApp &rarr;
                  </a>
                </aside>
              </div>

              <details className="v1-ladder">
                <summary>
                  <span>
                    <b>How payments work</b>
                    <small>3% deposit &middot; +7% at SPA &middot; 90% on completion</small>
                  </span>
                  <span className="v1-ladder-toggle" aria-hidden="true">+</span>
                </summary>
                <div className="v1-ladder-body">
                  <p className="v1-ladder-basis">
                    Illustration based on the {rm(RESERVE)} reserve price. Final amounts follow the agreed price.
                  </p>
                  <ol>
                    <li>
                      <span className="pct">3%</span>
                      <div><b>{DEPOSIT}</b><span>Tender deposit. Returned in full immediately if no sale proceeds.</span></div>
                    </li>
                    <li>
                      <span className="pct">+7%</span>
                      <div><b>{rm(RESERVE * 0.07)}</b><span>Balance of the 10% down payment on signing the SPA.</span></div>
                    </li>
                    <li>
                      <span className="pct">90%</span>
                      <div><b>{rm(RESERVE * 0.9)}</b><span>On completion, usually through your bank loan.</span></div>
                    </li>
                  </ol>
                  <p className="laddernote">
                    <b>Your tender deposit is the first part of the standard 10% down payment.</b>{" "}
                    Read the full process and terms on the <a href="#">How To Tender</a> page.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>




        {/* ── PROPERTY DETAILS ──────────────────────────────────────────────
            Rebuilt again 30 Jul on Bryan's iNewProject reference. The three pricing
            facts (psf / tenure / land title) act as the section's HEADING — they are
            what a sealed-tender buyer prices on. Everything else is one flat
            label/value list rendered two-up, which is the shape the backend actually
            edits: type a label, type a value. Hardcoded groups are gone; the array
            above is the single place a field is added or removed. */}
        <section className="blk band-card" id="details">
          <div className="wrap">
            <div className="blkcard dcard">
              <h2 className="sec-title">Property <span>Details</span></h2>

              {/* Fixed across every property-detail page: price basis, tenure, then
                  title and land use. The positions stay stable; only the correct
                  property-type area basis and listing data change. */}
              <div className="pd-pricing">
                <div>
                  <span className="lbl">Reserve price per sq ft</span>
                  <b className="pd-psf">{PSF ? `RM${PSF.toLocaleString("en-MY")}` : "\u2014"}<i>psf</i></b>
                  <span className="sub">Based on {PRICE_BASIS} built-up area</span>
                </div>
                <div>
                  <span className="lbl">Tenure</span>
                  <b>Leasehold 99 years</b>
                  <span className="sub">Expires Nov 2115 &middot; 89 years remaining</span>
                </div>
                <div>
                  <span className="lbl">Title &amp; land use</span>
                  <b>{TITLE_TYPE}</b>
                  <span className="sub">{LAND_USE} use</span>
                </div>
              </div>

              <div className="pd">
                <div className="band">
                  {BAND.map((b) => (
                    <div className="stat" key={b.label}>
                      <svg className="ic" viewBox="0 0 24 24"><path d={b.path} /></svg>
                      <div className="txt"><span className="v">{b.value}</span><span className="k">{b.label}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <dl className="pd-list">
                {PROPERTY_DETAILS.map((row) => (
                  <div className="pd-row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Bryan, 30 Jul: the box lists nothing. Enumerating four specific unknowns
                  only shrank as the agency filled them in, and it invited the buyer to
                  read the gaps as our omission. A listing can never be complete, so the
                  honest and permanent version is simply: whatever the details above do not
                  answer, the agent will. Slimmest possible form — invitation plus button. */}
              <section className="pd-ask">
                {/* A typeset question mark, not a stroked icon. Every emphasis on this page is
                    Newsreader — the H1, the prices, the dates — so a serif glyph belongs to the
                    same system, where a UI-kit help-circle belongs to a generic one. It is also
                    flat, needs no SVG, and at this size carries the band on its own. Burgundy,
                    not red: red is reserved for the action beside it. */}
                <span className="pd-ask-mark" aria-hidden="true">?</span>
                <div className="pd-ask-main">
                  <h3 className="pd-ask-title">Still have questions about this property?</h3>
                  <p className="pd-ask-lede">
                    If the details above don&rsquo;t answer everything, feel free to ask the appointed
                    agent anything &mdash; from how the tender process works to questions about the
                    property itself.
                  </p>
                </div>
                {/* "Get your answer" completes the heading's question — Q then A — and promises an
                    outcome rather than an activity. No "agent": the VOICE RULE keeps agency
                    identity in the agent block and the footer, not in front-of-house CTAs. It
                    also avoids echoing the word "question" from the heading directly above it.
                    Alternates considered: "Ask before you offer" (carries the sealed-tender logic
                    but repeats the lede), "Get in touch" (safe, forgettable), "Ask a question"
                    (redundant with the heading). */}
                <a className="pd-ask-cta" href="#agent">Get your answer</a>
              </section>

            </div>
          </div>
        </section>


        {/* ── ABOUT ─────────────────────────────────────────────────────────
            Rebuilt 30 Jul. The old version was four equal paragraphs at 98 characters
            per line (vs a ~68ch readable measure) with three of the four hidden behind
            "View more". A content audit found most of it restated the page:
              P1 "62 three-storey stratified townhouses"  → Property Details + header
              P2 "three practical storeys, shared vs private" → Storeys 3
              P4 schools / markets / KESAS / Federal Highway → §7 What's Nearby
              P3 completed, no construction risk, inspect the actual unit → UNIQUE
            So the only paragraph saying something nothing else on the page said was
            buried third, behind a fold. About now carries the ARGUMENT rather than
            re-describing the facts, and that argument is promoted to a pull-quote: on a
            sealed tender you commit one number with no second attempt, so a property you
            can physically walk through first is worth more than one you cannot. Nothing
            here duplicates Details or What's Nearby. Clamp removed — with the repetition
            gone it is short enough to read whole, which also drops the fade gradient's
            dependency on --band-bg. */}
        <section className="blk band-paper" id="about">
          <div className="wrap">
            <div className="blkcard about">
              <h2 className="sec-title">About <span>Residensi Sinaran</span></h2>
              <div className="aboutbody" id="about-body">
                <p className="about-lead">
                  Residensi Sinaran sits inside Taman Sri Muda, one of the older established
                  townships in Shah Alam &mdash; the kind of neighbourhood that finished growing a
                  decade ago. Sixty-two homes behind a single controlled entrance, which is small
                  enough that the place stays quiet.
                </p>
                <blockquote className="about-quote">
                  The development is complete and handed over, so you can walk the actual unit,
                  check the finishes and see the neighbours before deciding what to offer. That
                  matters more here than in a normal sale: a sealed tender gives you one number
                  and no second attempt.
                </blockquote>
                <p>
                  Each home runs over three storeys, which puts the shared living areas downstairs
                  and the private rooms above &mdash; the practical reason a family chooses a
                  townhouse over an apartment of the same size, and the reason the layout still
                  works as a household grows.
                </p>
                <p>
                  That the township is older is the point. Everything around it already exists,
                  and nothing about living here depends on a masterplan being finished or a
                  neighbouring phase being sold.
                </p>
              </div>
            </div>
          </div>
        </section>


        <section className="blk band-card" id="selling">
          <div className="wrap">
            <div className="blkcard">
              <h2 className="sec-title">Selling <span>Points</span></h2>
              <div className="spgrid"><div className="sp-item"><span className="sp-num">01</span><h3>Completed Homes, Ready to View</h3><p>Inspect the actual home and its surroundings before you commit.</p></div><div className="sp-item"><span className="sp-num">02</span><h3>Low-Density Community of 62 Homes</h3><p>Just 62 three-storey stratified townhouses in total.</p></div><div className="sp-item"><span className="sp-num">03</span><h3>Three-Storey Townhouse Living</h3><p>Multi-level layouts separate shared and private family space.</p></div><div className="sp-item"><span className="sp-num">04</span><h3>Gated and Guarded Environment</h3><p>A controlled environment for greater privacy and peace of mind.</p></div><div className="sp-item"><span className="sp-num">05</span><h3>Two Parking Bays per Home</h3><p>Each residence includes two parking bays.</p></div><div className="sp-item"><span className="sp-num">06</span><h3>Established Taman Sri Muda Location</h3><p>A mature Shah Alam neighbourhood with schools, shops and healthcare nearby.</p></div></div></div>
          </div>
        </section>


        {/* Facilities section removed — the 18 amenities listed were borrowed
            condominium content, not this 62-unit townhouse scheme. */}


        <section className="blk band-paper" id="area">
          <div className="wrap">
            <div className="blkcard">

              <h2 className="sec-title">What's <span>Nearby?</span></h2>
              <div className="amen">
                <div className="amencol">
                  <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.5c-3.6 0-6 2.3-6 5.6V16a2.5 2.5 0 0 0 2.5 2.5h7A2.5 2.5 0 0 0 18 16V8.1c0-3.3-2.4-5.6-6-5.6z" strokeLinecap="round" strokeLinejoin="round" /><path d="M7.4 10.6c1.4-1 3-1.5 4.6-1.5s3.2.5 4.6 1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M9.3 14.5h.01M14.7 14.5h.01" strokeLinecap="round" strokeLinejoin="round" /><path d="M9.2 18.6 7.2 22M14.8 18.6 16.8 22" strokeLinecap="round" strokeLinejoin="round" /></svg>Transportation</h3>
                  <div className="amenrow"><div className="nm"><b>Hab Taman Sri Muda</b><span>Rapid KL bus hub · Route 751</span></div><div className="dist"><b>1.2 km</b><span>4 min</span></div></div>
                  <div className="amenrow"><div className="nm"><b>KTM Shah Alam</b><span>KTM Komuter station</span></div><div className="dist"><b>3.8 km</b><span>8 min</span></div></div>
                  <div className="amenrow"><div className="nm"><b>LRT Alam Megah</b><span>Kelana Jaya Line · park-and-ride</span></div><div className="dist"><b>6.5 km</b><span>11 min</span></div></div>
                </div>
                <div className="amencol">
                  <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l9-4 9 4-9 4-9-4z" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5" strokeLinecap="round" strokeLinejoin="round" /></svg>Education</h3>
                  <div className="amenrow"><div className="nm"><b>SK Taman Sri Muda 2</b><span>National primary school</span></div><div className="dist"><b>1.8 km</b><span>5 min</span></div></div>
                  <div className="amenrow"><div className="nm"><b>SMK Taman Sri Muda</b><span>National secondary school</span></div><div className="dist"><b>2.3 km</b><span>6 min</span></div></div>
                  <div className="amenrow"><div className="nm"><b>UiTM Shah Alam</b><span>Public university</span></div><div className="dist"><b>7.0 km</b><span>14 min</span></div></div>
                </div>
                <div className="amencol">
                  <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.6 8.6h18.8l-1.8 9.5a2 2 0 0 1-2 1.6H6.4a2 2 0 0 1-2-1.6L2.6 8.6z" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.6 8.6 10.6 3.2M15.4 8.6 13.4 3.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 12.4v3.6M12 12.4v3.6M15 12.4v3.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Shopping</h3>
                  <div className="amenrow"><div className="nm"><b>Pasar Moden Sri Muda</b><span>Fresh market &amp; daily groceries</span></div><div className="dist"><b>1.4 km</b><span>4 min</span></div></div>
                  <div className="amenrow"><div className="nm"><b>Lotus's Shah Alam</b><span>Hypermarket &amp; retail</span></div><div className="dist"><b>6.6 km</b><span>12 min</span></div></div>
                  <div className="amenrow"><div className="nm"><b>AEON Mall Shah Alam</b><span>Shopping, dining &amp; entertainment</span></div><div className="dist"><b>7.8 km</b><span>14 min</span></div></div>
                </div>
                <div className="amencol">
                  <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2.5" y="7" width="19" height="13" rx="2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 7V5.6A1.6 1.6 0 0 1 10.6 4h2.8A1.6 1.6 0 0 1 15 5.6V7" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 11.2v5M9.5 13.7h5" strokeLinecap="round" strokeLinejoin="round" /></svg>Healthcare</h3>
                  <div className="amenrow"><div className="nm"><b>Watsons Sri Muda</b><span>Pharmacy &amp; personal care</span></div><div className="dist"><b>1.3 km</b><span>4 min</span></div></div>
                  <div className="amenrow"><div className="nm"><b>KPJ Selangor Specialist</b><span>Private specialist hospital</span></div><div className="dist"><b>4.8 km</b><span>9 min</span></div></div>
                  <div className="amenrow"><div className="nm"><b>Columbia Asia Bukit Rimau</b><span>24-hour emergency dept.</span></div><div className="dist"><b>5.4 km</b><span>10 min</span></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="blk band-card" id="location">
          <div className="wrap">
            <div className="blkcard">
              <h2 className="sec-title">Property <span>Location</span></h2>
              <div className="mapbox">
                <iframe title="Map — Taman Sri Muda, Shah Alam" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Residensi+Sinaran+Taman+Sri+Muda+Shah+Alam&amp;output=embed"></iframe>
              </div>
            </div>
          </div>
        </section>


        {/* Price History section removed — the transaction rows were invented sample
            data. Returns once real transactions are sourced (JPPH or agency records);
            the .sample-tag style in tender-detail.css is reserved for that. */}

        <section className="blk band-card" id="agent">
          <div className="wrap">
            <div className="blkcard">
              <h2 className="sec-title">Listing <span>Agent</span></h2>
              <div className="agentcard"><div className="ag-top"><img className="face" src={AGENT_PHOTO} alt="Stephen Yew" /><div className="meta"><b>Stephen Yew</b><div className="co">The One Property Global &middot; Licensed REA</div></div></div><dl className="ag-creds"><div><dt>REA registration</dt><dd className="na">Not stated</dd></div><div><dt>Agency registration</dt><dd className="na">Not stated</dd></div><div><dt>Role on this tender</dt><dd>Appointed agent</dd></div><div><dt>Direct line</dt><dd className="num">012-393 8255</dd></div></dl><div className="ag-foot"><a className="btn wa" href="https://wa.me/60123938255" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>WhatsApp</a><a className="btn burg" href="#">Send Enquiry</a></div></div></div></div></section>




        <section className="blk band-paper" id="mortgage">
          <div className="wrap">
            <div className="blkcard calc">
              <h2 className="sec-title">Mortgage <span>Calculator</span></h2>
              <div className="calcgrid">
                <div>
                  <div className="field"><label htmlFor="c-price">Property price (RM)</label><input type="number" id="c-price" defaultValue="517000" min="1" /></div>
                  <div className="field"><label htmlFor="c-down">Down payment (%)</label><input type="number" id="c-down" defaultValue="10" min="0" max="90" /></div>
                  <div className="field"><label htmlFor="c-tenure">Tenure (years)</label>
                    <select id="c-tenure" defaultValue="35">
                      <option>10</option><option>15</option><option>20</option><option>25</option><option>30</option><option>35</option>
                    </select>
                  </div>
                  <div className="field"><label htmlFor="c-rate">Interest rate (% p.a.)</label><input type="number" id="c-rate" defaultValue="4.0" step="0.05" min="0.1" /></div>
                </div>
                <div className="calcout">
                  <div className="big"><b className="num" id="c-monthly">RM 0</b><span>Estimated monthly repayment</span></div>
                  <div className="line"><span>Loan amount</span><b className="num" id="c-loan">RM 0</b></div>
                  <div className="line"><span>Total interest</span><b className="num" id="c-interest">RM 0</b></div>
                  <div className="line"><span>Total repayment</span><b className="num" id="c-total">RM 0</b></div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="blk band-card" id="faq">
          <div className="wrap">
            <h2 className="sec-title">Tender <span>FAQ</span></h2>
            <div className="faqcard">
              <div className="faq-item">
                <button type="button" className="faq-trigger" aria-expanded="false">What is the reserve price?<svg className="chev" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div className="faq-body"><p>The reserve price (RM517,000) is the minimum the seller will consider. Bids below it will not be selected.</p></div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-trigger" aria-expanded="false">How many bidders are there now?<svg className="chev" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div className="faq-body"><p>E-Tender is a sealed-bid exercise — the number of bidders and their offers stay confidential until the tender closes, so every buyer submits their honest best offer.</p></div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-trigger" aria-expanded="false">When is the closing date?<svg className="chev" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div className="faq-body"><p>This tender closes on <b>31 Dec 2028</b>. Submit your sealed bid and place the deposit before then via your member account.</p></div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-trigger" aria-expanded="false">Is my deposit refundable?<svg className="chev" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div className="faq-body"><p>Yes. Deposits are held by the registered estate agency as stakeholder. If the seller does not accept your offer — including after any negotiation — the agent tells you and returns your deposit in full immediately. There is no waiting period: once all three parties know the sale will not proceed, there is nothing left to wait for.</p></div>
              </div>
            </div>
          </div>
        </section>


        <section className="blk band-paper" id="similar">
          <div className="wrap">
            <h2 className="sec-title">Similar <span>Tenders</span></h2>
            <div className="simgrid">
              <a className="sim" href="/tender">
                <div className="im"><img src={PROJECT_IMG("ara-damansara-height.jpg")} alt="Ara Damansara Height" loading="lazy" /></div>
                <div className="bd"><span className="lc">Ara Damansara, Selangor</span><b>Ara Damansara Height</b><span className="pr num">RM1,000,000</span></div>
              </a>
              <a className="sim" href="/tender">
                <div className="im"><img src={PROJECT_IMG("meranti-terrace.jpg")} alt="Meranti Terrace" loading="lazy" /></div>
                <div className="bd"><span className="lc">Kota Kemuning, Selangor</span><b>Meranti Terrace</b><span className="pr num">RM615,000</span></div>
              </a>
              <a className="sim" href="/tender">
                <div className="im"><img src={PROJECT_IMG("kemuning-utama-corner-unit.jpg")} alt="Kemuning Utama corner unit" loading="lazy" /></div>
                <div className="bd"><span className="lc">Shah Alam, Selangor</span><b>Kemuning Utama Corner</b><span className="pr num">RM1,200,000</span></div>
              </a>
            </div>
          </div>
        </section>
      </main>


      <div className="bidbar" id="bidbar" aria-hidden="true">
        <div className="wrap in">
          <div className="identity"><span className="nm">Residensi Sinaran</span><span className="meta">Tender closes {TENDER_CLOSE_LABEL}</span></div>
          <div className="pr"><div className="k">Reserve price</div><div className="v num">RM517,000</div><span className="closes">Closes {TENDER_CLOSE_LABEL}</span></div>
          <a className="btn red" href="#">Apply for Tender</a>
        </div>
      </div>


      <div className="modal" id="imgmodal" aria-hidden="true" style={{background: "rgba(23,19,15,.92)"}}>
        <button type="button" id="imgmodal-close" aria-label="Close" style={{position: "absolute", top: "20px", right: "24px", background: "none", border: "none", color: "#fff", fontSize: "34px", lineHeight: "1", cursor: "pointer"}}>×</button>
        <img id="imgmodal-img" alt="Residensi Sinaran enlarged" style={{maxWidth: "92vw", maxHeight: "88vh", borderRadius: "8px", objectFit: "contain"}} />
      </div>
    </div>
  );
}
