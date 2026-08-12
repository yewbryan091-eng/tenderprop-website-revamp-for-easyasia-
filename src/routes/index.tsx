import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import "@/styles/tender-listings.css";
import "@/styles/home.css";

export const Route = createFileRoute("/")({ component: HomePage });

/* HOMEPAGE HERO — full-background platform entrance, 12 Aug 2026.

   Bryan's father rejected the diagonal treatment: the homepage needs to feel like the
   full entrance to TenderProp, not an E-Tender campaign page. Three Malaysian property
   scenes form one market panorama: urban skyline, everyday residential stock, and a
   landed home. The rendered comparison favoured a 23/54/23 crop so the centre reads as
   one dominant property canvas while the side scenes add breadth.

   The first two-product panel was removed at Bryan's direction. Keep the remaining
   canvas quiet until the next landing-page content treatment is chosen. */
function HomePage() {
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
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
