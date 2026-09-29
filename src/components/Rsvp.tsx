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
  "LOCATION:Sri Venkateswara Kalyana Mandapam\\, Alipiri Bypass Road\\, Tirupati\\, Andhra Pradesh 517501",
  "DESCRIPTION:Muhurtham at 10:48 AM during Rohini nakshatram. Please be seated by 10:30 AM.",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "UID:reception-20261122@aadhira-karthikeya",
  "DTSTAMP:20260101T000000Z",
  "DTSTART:20261122T133000Z",
  "DTEND:20261122T163000Z",
  "SUMMARY:Reception & Dinner — Aadhira weds Karthikeya",
  "LOCATION:Sri Venkateswara Kalyana Mandapam\\, Tirupati\\, Andhra Pradesh",
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
      setError("దయచేసి మీ పేరు తెలియజేయండి / Please enter your name.");
      return;
    }
    setError(null);
    setSent(true);
  };

  const share = async () => {
    const data = {
      title: "ఆదిర & కార్తికేయ వివాహ ఆహ్వానం · Aadhira weds Karthikeya",
      text: "ఆదిర & కార్తికేయ కళ్యాణ మహోత్సవం — 21 November 2026, Tirupati, Andhra Pradesh.",
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
          <Heading
            telugu="ఆహ్వాన సమాధానం"
            label="R.S.V.P."
            title="Tell us you are coming"
          />

          {!sent ? (
            <form onSubmit={submit} className="mt-10 space-y-8" noValidate>
              <div>
                <label htmlFor="rsvp-name" className="block">
                  <span className="font-telugu text-[0.92rem] font-medium text-ink">
                    మీ పూర్తి పేరు
                  </span>
                  <span className="label ml-2 text-ink-soft">Your name</span>
                </label>
                <input
                  id="rsvp-name"
                  className="field mt-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ఉదా: శ్రీనివాస రావు / e.g. Rukmini Subramanian"
                  aria-invalid={Boolean(error)}
                />
                {error && <p className="mt-2 text-[0.8rem] text-kumkum">{error}</p>}
              </div>

              <div>
                <p className="block">
                  <span className="font-telugu text-[0.92rem] font-medium text-ink">
                    ఎంతమంది విచ్చేస్తున్నారు
                  </span>
                  <span className="label ml-2 text-ink-soft">How many of you</span>
                </p>
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
                  <div className="flex flex-col">
                    <span className="font-telugu text-[0.85rem] text-ink-soft">
                      {guests === 1 ? "1 సీటు" : `${guests} సీట్లు`}
                    </span>
                    <span className="text-[0.78rem] text-ink-soft/80">
                      {guests === 1 ? "seat at the leaf" : "seats at the leaf"}
                    </span>
                  </div>
                </div>
              </div>

              <fieldset>
                <legend className="block">
                  <span className="font-telugu text-[0.92rem] font-medium text-ink">
                    విచ్చేస్తున్నారా?
                  </span>
                  <span className="label ml-2 text-ink-soft">Will you be there</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {[
                    {
                      value: "yes" as const,
                      telugu: "సంతోషంగా వస్తున్నాము",
                      english: "With joy, yes",
                    },
                    {
                      value: "no" as const,
                      telugu: "మనస్ఫూర్తిగా ఆశీర్వదిస్తున్నాము",
                      english: "There in spirit",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer border px-4 py-2.5 transition-colors ${
                        attending === opt.value
                          ? "border-kumkum bg-kumkum text-paper"
                          : "border-gold/60 text-ink-soft hover:bg-paper"
                      }`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={opt.value}
                        checked={attending === opt.value}
                        onChange={() => setAttending(opt.value)}
                        className="sr-only"
                      />
                      <span className="font-telugu block text-[0.88rem] font-medium leading-tight">
                        {opt.telugu}
                      </span>
                      <span className="label block mt-0.5 text-[0.62rem] opacity-85">
                        {opt.english}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="rsvp-msg" className="block">
                  <span className="font-telugu text-[0.92rem] font-medium text-ink">
                    వధూవరులకు మీ శుభాశీస్సులు
                  </span>
                  <span className="label ml-2 text-ink-soft">A blessing for the couple</span>
                </label>
                <textarea
                  id="rsvp-msg"
                  className="field mt-2 resize-none"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="వధూవరులకు మీ హృదయపూర్వక ఆశీస్సులు రాయండి... / Write something they will keep…"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-kumkum px-6 py-3.5 text-paper transition-colors hover:bg-kumkum-dark"
              >
                <span className="font-telugu block text-[1.05rem] font-medium leading-tight">
                  సమాధానం పంపండి
                </span>
                <span className="label block mt-0.5 text-[0.65rem] text-gold-light">
                  Send our reply
                </span>
              </button>

              <div className="text-center">
                <p className="font-telugu text-[0.85rem] text-ink-soft">
                  ఏర్పాట్ల నిమిత్తం దయచేసి 31 అక్టోబర్ 2026 లోపు తెలియజేయగలరు.
                </p>
                <p className="text-[0.78rem] text-ink-soft/80">
                  Kindly reply by 31 October 2026, so the banana leaves can be counted.
                </p>
              </div>
            </form>
          ) : (
            <div className="mt-10 text-center">
              <p className="font-telugu text-3xl font-medium text-kumkum">ధన్యవాదాలు</p>
              <p className="label mt-1 text-gold">Thank you</p>
              <p className="mt-4 font-display text-3xl leading-snug text-ink">
                {attending === "yes"
                  ? `Thank you, ${name.trim().split(" ")[0]}.`
                  : `Thank you, ${name.trim().split(" ")[0]} — we will feel it.`}
              </p>
              <p className="font-telugu mx-auto mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">
                {attending === "yes"
                  ? `కళ్యాణ మండపం నందు మీ కోసం ${guests} ${guests === 1 ? "సీటు" : "సీట్లు"} కేటాయించబడ్డాయి. శనివారం ఉదయం 10:30 గంటలకల్లా విచ్చేయగలరు.`
                  : "మీ ఆశీస్సులు వధూవరులకు అందజేయబడతాయి. వివాహ వేడుక ఛాయాచిత్రాలను మీకు తప్పక పంపుతాము."}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-[0.85rem] leading-relaxed text-ink-soft/80">
                {attending === "yes"
                  ? `${guests} ${guests === 1 ? "seat is" : "seats are"} held for you at the mandapam. Come by 10:30 on Saturday and celebrate with us.`
                  : "Your blessing has been written down and kept. We will send photographs from the wedding."}
              </p>
              {message.trim() && (
                <p className="mx-auto mt-6 max-w-sm border-l-2 border-gold/60 pl-4 text-left font-display text-lg text-ink italic">
                  “{message.trim()}”
                </p>
              )}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="font-telugu mt-8 text-kumkum underline underline-offset-4 text-[0.9rem]"
              >
                సమాధానాన్ని మార్చండి / Change our reply
              </button>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 border-t border-gold/40 pt-8 sm:flex-row">
            <button
              type="button"
              onClick={downloadIcs}
              className="flex-1 border border-gold/60 px-4 py-3 text-kumkum transition-colors hover:bg-paper"
            >
              <span className="font-telugu block text-[0.88rem] font-medium leading-tight">
                క్యాలెండర్‌కు జోడించండి
              </span>
              <span className="label block mt-0.5 text-[0.62rem]">Add to calendar</span>
            </button>
            <button
              type="button"
              onClick={share}
              className="flex-1 border border-gold/60 px-4 py-3 text-kumkum transition-colors hover:bg-paper"
            >
              <span className="font-telugu block text-[0.88rem] font-medium leading-tight">
                {copied ? "లింక్ కాపీ చేయబడింది!" : "ఆహ్వానాన్ని షేర్ చేయండి"}
              </span>
              <span className="label block mt-0.5 text-[0.62rem]">
                {copied ? "Link copied" : "Share this invitation"}
              </span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="font-telugu text-[0.92rem] text-ink-soft leading-relaxed">
              ఈ శుభసందర్భంగా తిరుపతి శ్రీ వేంకటేశ్వర నిత్య అన్నదాన ట్రస్ట్ (TTD) నందు అన్నదానం సమర్పించబడుతోంది.
            </p>
            <p className="mt-1 font-display text-base leading-relaxed text-ink-soft/80 italic">
              In place of seer, the families are offering annadanam through the Sri
              Venkateswara Nitya Annadanam Trust, Tirupati.
            </p>
          </div>
        </div>

        <Reveal className="mt-14">
          <footer className="pb-6 text-center">
            <p className="font-telugu text-2xl font-medium text-kumkum">శుభం</p>
            <p className="font-telugu mt-1 text-[0.95rem] text-ink-soft">
              ఆదిర &amp; కార్తికేయ · తిరుపతి, ఆంధ్రప్రదేశ్
            </p>
            <p className="label mt-1 text-ink-soft">Aadhira &amp; Karthikeya · Tirupati, Andhra Pradesh</p>
            <p className="tnum mt-2 font-display text-lg text-ink-soft">21 · 11 · 2026</p>
          </footer>
        </Reveal>
      </div>
    </section>
  );
}
