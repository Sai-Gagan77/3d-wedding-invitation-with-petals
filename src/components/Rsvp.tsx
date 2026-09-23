import { useState } from "react";
import type { FormEvent } from "react";
import { Heading, Reveal } from "./ui";

const ICS = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Aadhira weds Karthikeya//EN",
  "CALSCALE:GREGORIAN",
  "BEGIN:VEVENT",
  "UID:muhurtham-20261121@aadhira-karthikeya",
  "DTSTAMP:20260101T000000Z",
  "DTSTART:20261121T051800Z",
  "DTEND:20261121T070200Z",
  "SUMMARY:Mangalya Dharanam — Aadhira weds Karthikeya",
  "LOCATION:Sri Karpaga Vinayagar Kalyana Mandapam\\, 3rd Cross Street\\, Indira Nagar\\, Adyar\\, Chennai 600 020",
  "DESCRIPTION:Muhurtham at 10:48 AM during Rohini nakshatram. Please be seated by 10:30 AM.",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "UID:reception-20261122@aadhira-karthikeya",
  "DTSTAMP:20260101T000000Z",
  "DTSTART:20261122T133000Z",
  "DTEND:20261122T163000Z",
  "SUMMARY:Reception & Dinner — Aadhira weds Karthikeya",
  "LOCATION:Sri Karpaga Vinayagar Kalyana Mandapam\\, Adyar\\, Chennai",
  "DESCRIPTION:Doors at 7 PM, dinner from 8:30 PM.",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

function downloadIcs() {
  const blob = new Blob([ICS], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aadhira-weds-karthikeya.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Rsvp() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(2);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please tell us who is coming.");
      return;
    }
    setError(null);
    setSent(true);
  };

  const share = async () => {
    const data = {
      title: "Aadhira weds Karthikeya",
      text: "The wedding of Aadhira & Karthikeya — 21 November 2026, Chennai.",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="rsvp" className="scroll-mt-8 px-4 pb-16 sm:px-6">
      <div className="mx-auto max-w-[40rem]">
        <div className="rule-double-deep grain relative bg-paper-deep px-5 py-12 sm:px-10">
          <Heading tamil="பதில்" label="R.S.V.P." title="Tell us you are coming" />

          {!sent ? (
            <form onSubmit={submit} className="mt-10 space-y-8" noValidate>
              <div>
                <label htmlFor="rsvp-name" className="label text-ink-soft">
                  Your name
                </label>
                <input
                  id="rsvp-name"
                  className="field mt-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rukmini Subramanian"
                  aria-invalid={Boolean(error)}
                />
                {error && <p className="mt-2 text-[0.8rem] text-kumkum">{error}</p>}
              </div>

              <div>
                <p className="label text-ink-soft">How many of you</p>
                <div className="mt-3 flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    aria-label="One guest fewer"
                    className="h-10 w-10 border border-gold/60 font-display text-2xl leading-none text-kumkum transition-colors hover:bg-paper"
                  >
                    –
                  </button>
                  <span className="tnum font-display text-4xl leading-none text-ink">
                    {String(guests).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(12, g + 1))}
                    aria-label="One guest more"
                    className="h-10 w-10 border border-gold/60 font-display text-2xl leading-none text-kumkum transition-colors hover:bg-paper"
                  >
                    +
                  </button>
                  <span className="text-[0.82rem] text-ink-soft">
                    {guests === 1 ? "seat at the leaf" : "seats at the leaf"}
                  </span>
                </div>
              </div>

              <fieldset>
                <legend className="label text-ink-soft">Will you be there</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {(
                    [
                      ["yes", "With joy, yes"],
                      ["no", "There in spirit"],
                    ] as const
                  ).map(([value, text]) => (
                    <label
                      key={value}
                      className={`label cursor-pointer border px-5 py-3 transition-colors ${
                        attending === value
                          ? "border-kumkum bg-kumkum text-paper"
                          : "border-gold/60 text-ink-soft hover:bg-paper"
                      }`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={value}
                        checked={attending === value}
                        onChange={() => setAttending(value)}
                        className="sr-only"
                      />
                      {text}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="rsvp-msg" className="label text-ink-soft">
                  A blessing for the couple
                </label>
                <textarea
                  id="rsvp-msg"
                  className="field mt-2 resize-none"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something they will keep…"
                />
              </div>

              <button
                type="submit"
                className="label w-full bg-kumkum px-6 py-4 text-paper transition-colors hover:bg-kumkum-dark"
              >
                Send our reply
              </button>

              <p className="text-center text-[0.8rem] text-ink-soft">
                Kindly reply by 31 October 2026, so the banana leaves can be counted.
              </p>
            </form>
          ) : (
            <div className="mt-10 text-center">
              <p className="font-tamil text-2xl text-kumkum">நன்றி</p>
              <p className="mt-4 font-display text-3xl leading-snug text-ink">
                {attending === "yes"
                  ? `Thank you, ${name.trim().split(" ")[0]}.`
                  : `Thank you, ${name.trim().split(" ")[0]} — we will feel it.`}
              </p>
              <p className="mx-auto mt-4 max-w-sm text-[0.9rem] leading-relaxed text-ink-soft">
                {attending === "yes"
                  ? `${guests} ${guests === 1 ? "seat is" : "seats are"} held for you at the mandapam. Come by 10:30 on Saturday and find the old aunts — they know where the good coffee is.`
                  : "Your blessing has been written down and kept. We will send photographs from the Oonjal."}
              </p>
              {message.trim() && (
                <p className="mx-auto mt-6 max-w-sm border-l-2 border-gold/60 pl-4 text-left font-display text-lg text-ink italic">
                  “{message.trim()}”
                </p>
              )}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="label mt-8 text-kumkum underline underline-offset-4"
              >
                Change our reply
              </button>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 border-t border-gold/40 pt-8 sm:flex-row">
            <button
              type="button"
              onClick={downloadIcs}
              className="label flex-1 border border-gold/60 px-5 py-3 text-kumkum transition-colors hover:bg-paper"
            >
              Add to calendar
            </button>
            <button
              type="button"
              onClick={share}
              className="label flex-1 border border-gold/60 px-5 py-3 text-kumkum transition-colors hover:bg-paper"
            >
              {copied ? "Link copied" : "Share this invitation"}
            </button>
          </div>

          <p className="mt-8 text-center font-display text-lg leading-relaxed text-ink-soft italic">
            In place of seer, the families are feeding one hundred people at the Sri
            Ramakrishna Math on 23 November. Come, if you can.
          </p>
        </div>

        <Reveal className="mt-14">
          <footer className="pb-6 text-center">
            <p className="font-tamil text-lg text-kumkum">சுபம்</p>
            <p className="label mt-3 text-ink-soft">Aadhira &amp; Karthikeya · Chennai</p>
            <p className="tnum mt-2 font-display text-lg text-ink-soft">21 · 11 · 2026</p>
          </footer>
        </Reveal>
      </div>
    </section>
  );
}
