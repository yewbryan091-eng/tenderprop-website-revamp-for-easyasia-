import { createFileRoute } from "@tanstack/react-router";

import { ScrollCue } from "@/components/home/ScrollCue";
import { TwoWays } from "@/components/home/TwoWays";
import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import "@/styles/tender-listings.css";
import "@/styles/home.css";
import "@/styles/home-scrollcue.css";
import "@/styles/home-twoways.css";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
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
          </div>

          {/* Foot of the fold — sits under the product panel once it lands, and
              is positioned against the hero so it stays out of its layout. */}
          <ScrollCue />
        </section>

        <TwoWays />
      </main>
      <SiteFooter />
    </div>
  );
}
