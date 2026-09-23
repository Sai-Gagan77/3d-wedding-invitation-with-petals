import Hero from "./components/Hero";
import Invitation from "./components/Invitation";
import Rsvp from "./components/Rsvp";
import { Monogram } from "./components/ui";

export default function App() {
  return (
    <div className="relative min-h-screen bg-paper">
      <Hero />

      <main className="relative pb-24">
        <Invitation />
        <Rsvp />
      </main>

      {/* the date, always within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:w-auto sm:-translate-x-1/2">
        <div className="flex items-center justify-between gap-6 border-t border-gold/40 bg-kumkum-dark/95 px-5 py-3 backdrop-blur sm:rounded-full sm:border sm:px-7 sm:py-2.5 sm:shadow-[0_10px_30px_rgba(36,18,7,0.35)]">
          <div className="flex items-center gap-3">
            <Monogram className="h-6 w-6 shrink-0 sm:hidden" stroke="#E4C076" />
            <p className="tnum label text-gold-light">21 · 11 · 2026</p>
          </div>
          <a
            href="#rsvp"
            className="label bg-gold-light px-5 py-2.5 text-kumkum-dark transition-colors hover:bg-paper sm:px-6 sm:py-2"
          >
            RSVP
          </a>
        </div>
      </div>
    </div>
  );
}
