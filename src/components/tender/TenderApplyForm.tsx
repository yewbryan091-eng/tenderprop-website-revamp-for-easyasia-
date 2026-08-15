import { useMemo, useState } from "react";

import type { Tender } from "@/data/tenders";
import { ArrowRightIcon, CheckCircleIcon, HomeIcon, LockIcon, PinIcon } from "./icons";
import { daysLeft, depositOf, displayType, fmtDate, fmtPrice, tenderId } from "@/lib/tender-utils";

/* ── THE E-TENDER APPLICATION ──────────────────────────────────────────────────
   Built to the founder briefing (AGENTS.md, "WHAT TENDERPROP ACTUALLY IS"), which
   specifies this flow end to end. Three rails are non-negotiable and every decision
   below traces to one of them:

   1. MEMBERS ONLY. Step 1 of the founder's flow is a sign-in / sign-up gate. Auth is
      EasyAsia's to build and the member dashboard is PARKED by Bryan's own decision, so
      the gate here is the SCREEN, not the mechanism — it shows what has to exist without
      designing the dashboard behind it.
   2. NO MONEY MOVES THROUGH THIS SITE. EVER. The 3% deposit is collected afterwards by
      the agent, into the agency's client account, as BOVAEP requires. There is no payment
      field on this form and there must never be one. The deposit is DISCLOSED here, not
      taken — and it is labelled as such in three places, because a buyer who thinks they
      are about to be charged abandons the form.
   3. THE RESERVE IS A GUIDE, NOT A FLOOR. Buyers deliberately offer under it. The offer
      field is therefore free — no min attribute, no validation against the reserve, and
      copy that says so out loud. Naming your own number IS the e-tender.

   BOVAEP language: this form never says book, reserve, hold or secure. It submits an
   OFFER. The seller accepts, counters or declines, and a licensed agent carries it.

   VOICE: front-of-house is platform voice, but this is the APPLY POINT — one of the
   named disclosure zones where the licensed agency, its REA/REN and the client-account
   wording MUST appear. See the VOICE RULE in AGENTS.md. Do not strip the footnote. */

type Stage = "gate" | "form" | "done";

const AGENT = {
  name: "Stephen Yew",
  firm: "The One Property Global Sdn Bhd",
  title: "Licensed Real Estate Agent (REA)",
  reaNo: "12345",
  eNo: "E(1)2056",
};

export function TenderApplyForm({ listing }: { listing: Tender }) {
  const [stage, setStage] = useState<Stage>("gate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [offer, setOffer] = useState("");
  const [touched, setTouched] = useState(false);

  const deposit = depositOf(listing);
  const left = daysLeft(listing.closingDate);
  const ref = tenderId(listing).toUpperCase();

  /* Digits only, then formatted back for display. A property price typed with commas,
     spaces or an "RM" prefix is the normal thing a person does; rejecting it is the
     form being difficult about something it can simply understand. */
  const offerNum = useMemo(() => Number(offer.replace(/[^0-9]/g, "")) || 0, [offer]);
  /* fmtPrice, NOT fmtRM: fmtRM is the compact card formatter and renders this as "RM517k".
     An amount someone is committing to must echo back to the ringgit, exactly as typed. */
  const offerPretty = offerNum ? fmtPrice(offerNum) : "";
  /* Shown as information, never as a warning. An offer under the reserve is the product
     working, not a mistake — so this line stays neutral in tone and colour. */
  const belowReserve = offerNum > 0 && offerNum < listing.reservePrice;

  const missing = {
    name: !name.trim(),
    email: !/^\S+@\S+\.\S+$/.test(email.trim()),
    phone: phone.replace(/[^0-9]/g, "").length < 9,
    offer: offerNum <= 0,
  };
  const invalid = Object.values(missing).some(Boolean);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (invalid) return;
    /* No network call: EasyAsia owns the backend. The contract this screen implies is in
       BACKEND-CONTRACT.md — a lead containing the four buyer fields plus the listing
       reference. Nothing else on this page is user input. */
    setStage("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── STEP 1 — the members gate ─────────────────────────────────────────────── */
  if (stage === "gate") {
    return (
      <main className="tp-apply">
        <div className="apply-wrap apply-wrap-narrow">
          <ApplyMasthead listing={listing} left={left} />
          <section className="apply-gate">
            <span className="apply-gate-icon" aria-hidden="true"><LockIcon /></span>
            <h2>You need a TenderProp account to make an offer</h2>
            <p>
              Every e-tender is submitted under a verified account. It is how your offer stays
              tied to you, how the agent reaches you, and where your record of it lives
              afterwards.
            </p>
            <div className="apply-gate-actions">
              <button type="button" className="apply-btn" onClick={() => setStage("form")}>
                Sign in<ArrowRightIcon />
              </button>
              <button type="button" className="apply-btn is-ghost" onClick={() => setStage("form")}>
                Create an account
              </button>
            </div>
            <p className="apply-gate-note">
              Creating an account is free. It does not commit you to anything &mdash; you can look
              at the form before you decide.
            </p>
          </section>
        </div>
      </main>
    );
  }

  /* ── STEP 3 — the receipt ──────────────────────────────────────────────────── */
  if (stage === "done") {
    return (
      <main className="tp-apply">
        <div className="apply-wrap apply-wrap-narrow">
          <section className="apply-done">
            <span className="apply-done-icon" aria-hidden="true"><CheckCircleIcon /></span>
            <p className="apply-eyebrow">Offer submitted</p>
            <h1>Your e-tender is with the agent</h1>
            <p className="apply-done-lede">
              {name.split(" ")[0] || "Thank you"} &mdash; your offer of <b>{offerPretty}</b> on{" "}
              <b>{listing.name}</b> has been recorded against reference <b>{ref}</b>.
            </p>
            <dl className="apply-receipt">
              <div><dt>Reference</dt><dd>{ref}</dd></div>
              <div><dt>Your offer</dt><dd>{offerPretty}</dd></div>
              <div><dt>E-Tender closes</dt><dd>{fmtDate(listing.closingDate)}</dd></div>
              <div><dt>We will contact</dt><dd>{phone || email}</dd></div>
            </dl>
            <WhatHappensNext listing={listing} deposit={deposit} />
            <p className="apply-done-note">
              A copy is saved to your account. Nothing has been charged, and no payment is taken
              on this website.
            </p>
          </section>
          <Disclosure />
        </div>
      </main>
    );
  }

  /* ── STEP 2 — the application ──────────────────────────────────────────────── */
  return (
    <main className="tp-apply">
      <div className="apply-wrap">
        <ApplyMasthead listing={listing} left={left} />

        <form className="apply-grid" onSubmit={submit} noValidate>
          <div className="apply-main">
            {/* Bryan, 4 Aug: "top section should be the key things about the property, and
                then only contact details and how much they want to offer." Read-only on
                purpose — every value here is listing data, so none of it is a question. */}
            <section className="apply-card">
              <h2 className="apply-h">The property</h2>
              <dl className="apply-facts">
                <div><dt>Reference</dt><dd>{ref}</dd></div>
                <div><dt>Property</dt><dd>{listing.name}</dd></div>
                <div className="is-wide"><dt>Address</dt><dd>{listing.address ?? `${listing.area}, ${listing.stateName}`}</dd></div>
                <div><dt>Type</dt><dd>{displayType(listing)}</dd></div>
                <div><dt>Tenure</dt><dd>{listing.tenure}</dd></div>
                {listing.builtUp && <div><dt>Built-up area</dt><dd>{listing.builtUp}</dd></div>}
                {listing.landArea && <div><dt>Land area</dt><dd>{listing.landArea}</dd></div>}
                <div><dt>Reserve price</dt><dd>{fmtPrice(listing.reservePrice)}</dd></div>
                <div><dt>E-Tender closes</dt><dd>{fmtDate(listing.closingDate)}</dd></div>
              </dl>
            </section>

            <section className="apply-card">
              <h2 className="apply-h">Your details</h2>
              <p className="apply-sub">This is how the agent reaches you. Nothing is published.</p>
              <div className="apply-fields">
                <Field
                  id="ap-name" label="Full name" value={name} onChange={setName}
                  autoComplete="name" invalid={touched && missing.name}
                  error="Please enter your full name."
                />
                <Field
                  id="ap-email" label="Email" type="email" value={email} onChange={setEmail}
                  autoComplete="email" invalid={touched && missing.email}
                  error="Please enter a valid email address."
                />
                <Field
                  id="ap-phone" label="Mobile number" type="tel" value={phone} onChange={setPhone}
                  autoComplete="tel" inputMode="tel" placeholder="012-345 6789"
                  invalid={touched && missing.phone}
                  error="Please enter a contactable mobile number."
                  hint="The agent calls or WhatsApps this number."
                />
              </div>
            </section>

            <section className="apply-card apply-card-offer">
              <h2 className="apply-h">Your offer</h2>
              {/* THE ONE FIELD THIS WHOLE PAGE EXISTS FOR. No min, no max, no validation
                  against the reserve — deliberately. The reserve is a guide and offering
                  under it is the product working. */}
              <p className="apply-sub">
                The reserve price is <b>{fmtPrice(listing.reservePrice)}</b>. That is a guide, not a
                minimum &mdash; you may offer above it, at it, or below it. The seller can accept,
                counter, or decline.
              </p>
              <div className="apply-fields">
                <div className={"apply-field is-money" + (touched && missing.offer ? " is-invalid" : "")}>
                  <label htmlFor="ap-offer">How much are you offering?</label>
                  <div className="apply-money">
                    <span className="apply-money-rm" aria-hidden="true">RM</span>
                    <input
                      id="ap-offer" name="offer" inputMode="numeric" autoComplete="off"
                      placeholder="517,000" value={offer}
                      aria-describedby={touched && missing.offer ? "ap-offer-err" : "ap-offer-echo"}
                      aria-invalid={touched && missing.offer ? true : undefined}
                      onChange={(e) => setOffer(e.target.value)}
                    />
                  </div>
                  <p className="apply-echo" id="ap-offer-echo" aria-live="polite">
                    {offerPretty
                      ? `You are offering ${offerPretty}${belowReserve ? " — below the reserve, which is allowed." : ""}`
                      : " "}
                  </p>
                  {touched && missing.offer && (
                    <p className="apply-err" id="ap-offer-err">Please enter the amount you want to offer.</p>
                  )}
                </div>
              </div>
            </section>

            <div className="apply-submit">
              <button type="submit" className="apply-btn is-lg">
                Submit my e-tender<ArrowRightIcon />
              </button>
              <p className="apply-submit-note">
                Submitting sends your offer to the listing agent. <b>No payment is taken on this
                website</b> and nothing is charged now.
              </p>
              {touched && invalid && (
                <p className="apply-err apply-err-top" role="alert">
                  Please complete the highlighted fields before submitting.
                </p>
              )}
            </div>
          </div>

          <aside className="apply-side">
            <section className="apply-card apply-card-deposit">
              <h2 className="apply-h">The e-tender deposit</h2>
              <p className="apply-deposit-value">{deposit}</p>
              <p className="apply-deposit-basis">3% of the reserve price</p>
              {/* The single most misread fact on the platform. Three things must land here:
                  it is not an extra cost, it is not paid on this site, and it comes back if
                  the offer is not accepted. */}
              <ul className="apply-deposit-points">
                <li>
                  <b>It is not an extra cost.</b> It is the earnest deposit, and it becomes the
                  first part of the standard 10% down payment.
                </li>
                <li>
                  <b>You do not pay it here.</b> The agent collects it into the agency&rsquo;s client
                  account after they have spoken to you.
                </li>
                <li>
                  <b>It comes back in full</b> if your offer is not accepted.
                </li>
              </ul>
            </section>
            <WhatHappensNext listing={listing} deposit={deposit} />
          </aside>
        </form>

        <Disclosure />
      </div>
    </main>
  );
}

/* ── pieces ────────────────────────────────────────────────────────────────── */

function ApplyMasthead({ listing, left }: { listing: Tender; left: number }) {
  return (
    <header className="apply-head">
      <p className="apply-eyebrow">Submit an e-tender</p>
      <h1>{listing.name}</h1>
      <p className="apply-head-meta">
        <span><PinIcon />{listing.area}, {listing.stateName}</span>
        <span><HomeIcon />{displayType(listing)}</span>
      </p>
      {left > 0 && (
        <p className="apply-head-close">
          Closes {fmtDate(listing.closingDate)} &middot; <b>{left} {left === 1 ? "day" : "days"} left</b>
        </p>
      )}
    </header>
  );
}

/* The founder's own step list, in his order. It answers the question that actually stops
   people submitting — "what happens to me after I press this" — and it is the reason the
   viewing correction (3 Aug) matters: the offer comes first, but the viewing DOES happen. */
function WhatHappensNext({ listing, deposit }: { listing: Tender; deposit: string }) {
  return (
    <section className="apply-card apply-next">
      <h2 className="apply-h">What happens next</h2>
      <ol className="apply-steps">
        <li><b>The agent contacts you.</b> Your offer notifies {AGENT.name} directly.</li>
        <li><b>You view the property.</b> The agent arranges the viewing with you.</li>
        <li>
          <b>You place the {deposit} deposit</b> with the agency, into its client account
          &mdash; not on this website.
        </li>
        <li>
          <b>Your offer goes to the seller.</b> They accept, counter, or decline. If they counter,
          you can submit again.
        </li>
      </ol>
      <p className="apply-next-foot">
        All offers stay sealed until the e-tender closes on {fmtDate(listing.closingDate)}.
      </p>
    </section>
  );
}

/* Act 242 disclosure. The apply point is a named disclosure zone — see the VOICE RULE. */
function Disclosure() {
  return (
    <p className="apply-legal">
      E-Tenders on TenderProp are handled by <b>{AGENT.firm}</b> ({AGENT.eNo}), a licensed real
      estate agency. Your offer is presented to the seller by {AGENT.name}, {AGENT.title}{" "}
      (REA {AGENT.reaNo}). Deposits are held in the agency&rsquo;s client account in accordance with
      the Valuers, Appraisers, Estate Agents and Property Managers Act 1981. TenderProp does not
      collect payment.
    </p>
  );
}

function Field({
  id, label, value, onChange, type = "text", autoComplete, inputMode, placeholder,
  invalid, error, hint,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; autoComplete?: string; inputMode?: "tel" | "numeric" | "text";
  placeholder?: string; invalid?: boolean; error?: string; hint?: string;
}) {
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;
  return (
    <div className={"apply-field" + (invalid ? " is-invalid" : "")}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id} name={id} type={type} value={value} placeholder={placeholder}
        autoComplete={autoComplete} inputMode={inputMode}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={invalid ? errId : hint ? hintId : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {invalid && error ? (
        <p className="apply-err" id={errId}>{error}</p>
      ) : hint ? (
        <p className="apply-hint" id={hintId}>{hint}</p>
      ) : null}
    </div>
  );
}
