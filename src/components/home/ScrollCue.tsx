/* ── THE SCROLL CUE — "See how it works" ──────────────────────────────────────
   Sits at the foot of the fold, under the E-Tender / Owner Auction panel
   (Bryan's sketch, 13 Aug). Two jobs: tell the reader there is more page below
   the full-height hero, and name what is down there — a bare chevron says
   "scroll", this says "scroll for the explanation", which is the actual reason
   a first-time buyer should keep going.

   It is a real anchor, not decoration: keyboard-reachable, and it lands on the
   showcase band rather than scrolling a fixed distance. Absolutely positioned
   against the hero so it never enters the hero's own layout flow — the fold's
   centring stays exactly as the hero author set it. */
export function ScrollCue() {
  return (
    <a className="hp-cue" href="#how-it-works">
      <span className="hp-cue-mouse" aria-hidden="true">
        <span className="hp-cue-wheel" />
      </span>
      <span className="hp-cue-label">See how it works</span>
    </a>
  );
}
