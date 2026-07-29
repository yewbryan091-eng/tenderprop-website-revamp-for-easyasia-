import type { ReactNode } from "react";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import "@/styles/tender-listings.css";
import "@/styles/site-shell.css";

/* The frame every not-yet-decorated page hangs on: real chrome, real route,
   structured rooms. Decoration replaces the .frame blocks section by section. */

export type FrameSection = {
  title: string;
  what: string; // one line: what this section will do for the visitor
  blocked?: string; // founder input that gates it, if any
};

export function PageShell({
  eyebrow,
  title,
  lede,
  children,
  frames,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  children?: ReactNode;
  frames?: FrameSection[];
}) {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <section className="shell-hero">
          <div className="wrap">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="lede">{lede}</p>
          </div>
        </section>
        {children}
        {frames && frames.length > 0 && (
          <section className="shell-frames">
            <div className="wrap">
              <p className="frames-note">
                <span className="tag">Page frame</span>
                These are the sections this page will hold — approved structure, content being built.
              </p>
              <div className="frame-grid">
                {frames.map((f, i) => (
                  <div className="frame" key={f.title}>
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <h2>{f.title}</h2>
                    <p>{f.what}</p>
                    {f.blocked && <span className="blocked">Needs: {f.blocked}</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
