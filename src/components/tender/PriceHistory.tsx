import { useState } from "react";

import "@/styles/price-history.css";

/* ── PRICE HISTORY — comparable sale and rental evidence ──────────────────────
   Rebuilt 10 Aug on Bryan's brief: "the current structure is lacking and ugly, it needs
   a revamp in terms of structure and design wise". Structure first — the values stay
   masked until the JPPH feed is wired, exactly as the 3 Aug ledger requires.

   A STANDALONE COMPONENT, and that is deliberate on two counts:
   · `ResidensiSinaranDetail.tsx` is claimed by Codex in TEAM-LOG §1. Extracting the
     section means the edit to his file is an import and one tag instead of ~200 lines of
     markup — the smallest collision surface available.
   · Both listing pages need this section. One component is how the E-Tender and Owner
     Auction pages stop being two copies of it that drift.

   WHAT CHANGED, AND WHY — four structural faults in the old table:

   1. NO SENSE OF SCALE. Four bare rows told a buyer what three properties sold for and
      nothing about whether that made this one cheap or dear. A summary strip now leads:
      median psf, the range, and how many records over what period. That is the number a
      valuer reads first, and it is what makes the rows beneath it mean something.
      (NOT a subject-property strip — the 3 Aug ledger removed that deliberately, because
      repeating this listing's own price and specs added no decision value. This
      summarises the COMPARABLES, which is a different job.)
   2. THE EYE HAD TO TRAVEL. A four-column table spread the property and its price across
      the full page width. Rows are now cards: the property and its money sit in one
      object, and psf sits under the price where the comparison actually happens.
   3. THE SWITCH WAS WEAK. Buy/Rent were small underlined text links, far from the content
      they controlled. Now a segmented control directly above the rows, which is also what
      the iProperty/Brickz reference does — the one part of it worth taking.
   4. NO PROVENANCE. Evidence with no source and no date is not evidence. The footer now
      carries scope, source and an "as at" stamp — the thing a valuation firm can say and
      a portal cannot.

   The row DISCLOSURE is new too: five rows is the right count on the surface (Bryan:
   "4-5 information is fine"), but a valuer's detail — tenure, distance, floor — should be
   reachable without turning the section into a spreadsheet. */

type Mode = "buy" | "rent";

type EvidenceRow = {
  id: string;
  date: string;
  property: string;
  context: string;
  size: string;
  amount: string;
  unitRate: string;
  /* Revealed by the row's own disclosure. Kept short: a valuer's qualifiers, not a dump. */
  detail: { label: string; value: string }[];
};

/* ⚠️ MASKED PREVIEW DATA, and it must stay masked until JPPH is wired. The 3 Aug ledger:
   the section "must remain reviewable without turning sample values into property
   claims". Every figure here is Xs on purpose — they show the SHAPE of a record, never a
   number anyone could mistake for a real transaction. Swap this constant for the feed and
   nothing else in this file changes. */
const PREVIEW: Record<Mode, EvidenceRow[]> = {
  buy: [
    {
      id: "b1",
      date: "MMM YYYY",
      property: "Nearby comparable A",
      context: "Townhouse · same scheme",
      size: "1,4XX sq ft",
      amount: "RM XXX,XXX",
      unitRate: "RM XXX psf",
      detail: [
        { label: "Tenure", value: "—" },
        { label: "Distance", value: "—" },
        { label: "Land area", value: "—" },
        { label: "Reference", value: "JPPH —" },
      ],
    },
    {
      id: "b2",
      date: "MMM YYYY",
      property: "Nearby comparable B",
      context: "Townhouse · nearby scheme",
      size: "1,4XX sq ft",
      amount: "RM XXX,XXX",
      unitRate: "RM XXX psf",
      detail: [
        { label: "Tenure", value: "—" },
        { label: "Distance", value: "—" },
        { label: "Land area", value: "—" },
        { label: "Reference", value: "JPPH —" },
      ],
    },
    {
      id: "b3",
      date: "MMM YYYY",
      property: "Nearby comparable C",
      context: "Townhouse · same scheme",
      size: "1,3XX sq ft",
      amount: "RM XXX,XXX",
      unitRate: "RM XXX psf",
      detail: [
        { label: "Tenure", value: "—" },
        { label: "Distance", value: "—" },
        { label: "Land area", value: "—" },
        { label: "Reference", value: "JPPH —" },
      ],
    },
    {
      id: "b4",
      date: "MMM YYYY",
      property: "Nearby comparable D",
      context: "Townhouse · same locality",
      size: "1,5XX sq ft",
      amount: "RM XXX,XXX",
      unitRate: "RM XXX psf",
      detail: [
        { label: "Tenure", value: "—" },
        { label: "Distance", value: "—" },
        { label: "Land area", value: "—" },
        { label: "Reference", value: "JPPH —" },
      ],
    },
    {
      id: "b5",
      date: "MMM YYYY",
      property: "Nearby comparable E",
      context: "Townhouse · nearby scheme",
      size: "1,3XX sq ft",
      amount: "RM XXX,XXX",
      unitRate: "RM XXX psf",
      detail: [
        { label: "Tenure", value: "—" },
        { label: "Distance", value: "—" },
        { label: "Land area", value: "—" },
        { label: "Reference", value: "JPPH —" },
      ],
    },
  ],
  rent: [
    {
      id: "r1",
      date: "MMM YYYY",
      property: "Nearby rental A",
      context: "Townhouse · tenancy evidence",
      size: "1,4XX sq ft",
      amount: "RM X,XXX / mo",
      unitRate: "RM X.XX psf",
      detail: [
        { label: "Tenure", value: "—" },
        { label: "Distance", value: "—" },
        { label: "Furnishing", value: "—" },
        { label: "Evidence", value: "Tenancy" },
      ],
    },
    {
      id: "r2",
      date: "MMM YYYY",
      property: "Nearby rental B",
      context: "Townhouse · asking evidence",
      size: "1,4XX sq ft",
      amount: "RM X,XXX / mo",
      unitRate: "RM X.XX psf",
      detail: [
        { label: "Tenure", value: "—" },
        { label: "Distance", value: "—" },
        { label: "Furnishing", value: "—" },
        { label: "Evidence", value: "Asking" },
      ],
    },
    {
      id: "r3",
      date: "MMM YYYY",
      property: "Nearby rental C",
      context: "Townhouse · tenancy evidence",
      size: "1,3XX sq ft",
      amount: "RM X,XXX / mo",
      unitRate: "RM X.XX psf",
      detail: [
        { label: "Tenure", value: "—" },
        { label: "Distance", value: "—" },
        { label: "Furnishing", value: "—" },
        { label: "Evidence", value: "Tenancy" },
      ],
    },
    {
      id: "r4",
      date: "MMM YYYY",
      property: "Nearby rental D",
      context: "Townhouse · tenancy evidence",
      size: "1,5XX sq ft",
      amount: "RM X,XXX / mo",
      unitRate: "RM X.XX psf",
      detail: [
        { label: "Tenure", value: "—" },
        { label: "Distance", value: "—" },
        { label: "Furnishing", value: "—" },
        { label: "Evidence", value: "Tenancy" },
      ],
    },
  ],
};

/* The summary strip. Three facts, and each earns its place: the MEDIAN is the anchor a
   valuer quotes, the RANGE says how tight the evidence is (a wide spread is itself a
   finding), and the COUNT + PERIOD is the sample you are being asked to trust. */
const SUMMARY: Record<Mode, { label: string; value: string; sub: string }[]> = {
  buy: [
    { label: "Median", value: "RM XXX", sub: "psf, transacted" },
    { label: "Range", value: "RM XXX – XXX", sub: "psf across evidence" },
    { label: "Evidence", value: "X records", sub: "last XX months" },
  ],
  rent: [
    { label: "Median", value: "RM X.XX", sub: "psf per month" },
    { label: "Range", value: "RM X.XX – X.XX", sub: "psf across evidence" },
    { label: "Evidence", value: "X records", sub: "last XX months" },
  ],
};

const MODES: Mode[] = ["buy", "rent"];

export function PriceHistory() {
  const [mode, setMode] = useState<Mode>("buy");
  /* One row open at a time. A set would let a reader open all five and turn a scannable
     ledger back into the wall of text this rebuild removed. */
  const [openRow, setOpenRow] = useState<string | null>(null);

  const rows = PREVIEW[mode];

  return (
    <div className="ph">
      <div className="ph-head">
        <div className="ph-intro">
          <h2 className="sec-title">
            Price <span>History</span>
          </h2>
          <p className="ph-lede">
            Comparable sale and rental evidence for similar properties near this listing, selected
            on a like-for-like basis.
          </p>
        </div>

        {/* The segmented control — the one thing worth taking from the iProperty
            reference. Arrow-key support is carried over from the tabs it replaces; losing
            it would have been a silent accessibility regression. */}
        <div className="ph-switch" role="tablist" aria-label="Evidence type">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              id={`ph-tab-${m}`}
              role="tab"
              aria-selected={mode === m}
              aria-controls="ph-panel"
              tabIndex={mode === m ? 0 : -1}
              className={mode === m ? "is-active" : ""}
              onClick={() => {
                setMode(m);
                setOpenRow(null);
              }}
              onKeyDown={(e) => {
                if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
                e.preventDefault();
                const next: Mode = mode === "buy" ? "rent" : "buy";
                setMode(next);
                setOpenRow(null);
                window.requestAnimationFrame(() =>
                  document.getElementById(`ph-tab-${next}`)?.focus(),
                );
              }}
            >
              {m === "buy" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      <div className="ph-panel" id="ph-panel" role="tabpanel" aria-labelledby={`ph-tab-${mode}`}>
        {/* SUMMARY FIRST. Without it the rows are three prices with nothing to measure
            them against — the single biggest fault in the version this replaces. */}
        <div className="ph-summary">
          {SUMMARY[mode].map((s) => (
            <div className="ph-stat" key={s.label}>
              <span className="ph-stat-label">{s.label}</span>
              <b className="ph-stat-value">{s.value}</b>
              <span className="ph-stat-sub">{s.sub}</span>
            </div>
          ))}
          <span className="ph-preview" title="Structure only — figures arrive with the JPPH feed">
            Layout preview
          </span>
        </div>

        <div className="ph-rows">
          {/* A header row, not a <table>: the rows are disclosure widgets, and a table
              whose cells contain buttons that expand extra rows is markup nobody enjoys.
              The labels stay for scanning; each row repeats them for screen readers. */}
          <div className="ph-rowhead" aria-hidden="true">
            <span>Date</span>
            <span>Comparable property</span>
            <span>Built-up</span>
            <span className="ph-num">{mode === "buy" ? "Transacted price" : "Monthly rent"}</span>
            <span />
          </div>

          {rows.map((row) => {
            const open = openRow === row.id;
            return (
              <div className={"ph-row" + (open ? " is-open" : "")} key={row.id}>
                <button
                  type="button"
                  className="ph-row-btn"
                  aria-expanded={open}
                  aria-controls={`ph-detail-${row.id}`}
                  onClick={() => setOpenRow(open ? null : row.id)}
                >
                  <span className="ph-date">
                    <span className="ph-sr">Date </span>
                    {row.date}
                  </span>
                  <span className="ph-prop">
                    <b>{row.property}</b>
                    <span>{row.context}</span>
                  </span>
                  <span className="ph-size">
                    <span className="ph-sr">Built-up </span>
                    {row.size}
                  </span>
                  <span className="ph-money">
                    <b>{row.amount}</b>
                    <span>{row.unitRate}</span>
                  </span>
                  <span className="ph-chev" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                <div className="ph-detail" id={`ph-detail-${row.id}`} hidden={!open}>
                  <dl>
                    {row.detail.map((d) => (
                      <div key={d.label}>
                        <dt>{d.label}</dt>
                        <dd>{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            );
          })}
        </div>

        {/* PROVENANCE. Evidence without a source and a date is not evidence — and this is
            the line a licensed valuation firm can write and a portal cannot. The reference
            says "Source: Brickz.my" because it is quoting somebody else; this one names
            the registry directly. */}
        <p className="ph-source">
          <span>
            Comparables selected on a like-for-like basis — same or adjacent scheme, similar
            built-up, transacted within the stated period.
          </span>
          <span className="ph-source-meta">Source: JPPH / NAPIC transaction data · as at —</span>
        </p>
      </div>
    </div>
  );
}
