import { useEffect, useState } from "react";
import sadhya from "../assets/sadhya.jpg";
import thali from "../assets/thali.jpg";
import { CornerFlourish, Divider, Heading, Reveal } from "./ui";

const MUHURTHAM = new Date("2026-11-21T10:48:00+05:30");

/* ------------------------------------------------------------------ */
/*  Countdown                                                          */
/* ------------------------------------------------------------------ */

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const s = Math.floor(diff / 1000);
  return {
    past: target.getTime() <= now,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function Cell({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex-1 px-1 text-center">
      <p className="tnum font-display text-[2.6rem] leading-none font-light text-kumkum sm:text-[3.2rem]">
        {String(value).padStart(2, "0")}
      </p>
      <p className="label mt-2 text-ink-soft">{unit}</p>
    </div>
  );
}

function Countdown() {
  const c = useCountdown(MUHURTHAM);
  return (
    <section className="pt-12 sm:pt-16">
      <p className="label text-center text-gold">
        {c.past ? "The mangalyam has been tied" : "Until the mangalyam is tied"}
      </p>
      {c.past ? (
        <p className="mx-auto mt-5 max-w-sm text-center font-display text-2xl leading-snug text-ink italic">
          Thank you for standing with us in the hour of 10:48. Your blessings are the
          only gift that lasts.
        </p>
      ) : (
        <div className="mt-6 flex items-stretch divide-x divide-gold/35">
          <Cell value={c.days} unit="days" />
          <Cell value={c.hours} unit="hours" />
          <Cell value={c.minutes} unit="minutes" />
          <Cell value={c.seconds} unit="seconds" />
        </div>
      )}
      <p className="tnum mt-6 text-center font-display text-lg text-ink-soft">
        Rohini nakshatram · 10:48 – 11:32 in the forenoon
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Ceremonies                                                         */
/* ------------------------------------------------------------------ */

type Item = { time: string; name: string; note: string; featured?: boolean };

const DAYS: { day: string; date: string; place: string; items: Item[] }[] = [
  {
    day: "Friday",
    date: "20 November 2026",
    place: "The bride's home, 12th Main Road, Indira Nagar, Adyar",
    items: [
      {
        time: "06:00 PM",
        name: "Vratham",
        note: "The households set the day's work aside. A lamp is lit, the kudam is set, and the fast of the vratham begins.",
      },
      {
        time: "07:30 PM",
        name: "Naalangu",
        note: "Turmeric, teasing and the old games played between bride and groom, sung by the women of both families.",
      },
    ],
  },
  {
    day: "Saturday",
    date: "21 November 2026",
    place: "Sri Karpaga Vinayagar Kalyana Mandapam, Adyar",
    items: [
      {
        time: "07:00 AM",
        name: "Janavasakam & Kashi Yatra",
        note: "Karthikeya is received at the hall gate with a lit lamp, then sets off mock-seriously for Kashi and is turned back by the bride's father.",
      },
      {
        time: "08:30 AM",
        name: "Maalai Maatral",
        note: "Garlands are exchanged three times — each family lifting their own a little higher each time.",
      },
      {
        time: "09:30 AM",
        name: "Oonjal",
        note: "The swing is hung. Coloured rice is thrown to the four directions and the couple is rocked gently while the elders sing.",
      },
      {
        time: "10:48 AM",
        name: "Mangalya Dharanam",
        note: "The mangalyam is tied at 10:48 AM during Rohini nakshatram and the hour closes at 11:32. Please be seated in the hall by 10:30 AM.",
        featured: true,
      },
      {
        time: "11:45 AM",
        name: "Saptapadi & Laaja Homam",
        note: "Seven steps taken around the sacred fire, and parched rice offered to Agni by the bride's brother.",
      },
      {
        time: "12:30 PM",
        name: "Sadhya",
        note: "The wedding feast, served on a banana leaf. Start at the left, the salt goes at the top, and leave a little space for the payasam.",
      },
    ],
  },
  {
    day: "Sunday",
    date: "22 November 2026",
    place: "Sri Karpaga Vinayagar Kalyana Mandapam, Adyar",
    items: [
      {
        time: "11:00 AM",
        name: "Grihapravesham",
        note: "Aadhira is welcomed at the threshold in Coimbatore with a lamp and a pot of rice — for the families.",
      },
      {
        time: "07:00 PM",
        name: "Reception & Dinner",
        note: "An evening of music, filter coffee and dinner. Doors open at 07:00 PM, dinner served from 08:30 PM.",
      },
    ],
  },
];

function Ceremonies() {
  return (
    <section id="ceremonies" className="scroll-mt-8 pt-16 sm:pt-20">
      <Heading tamil="இதழ்" label="Order of ceremonies" title="Three days, from lamp to feast" />
      <div className="mt-12 space-y-14">
        {DAYS.map((day) => (
          <Reveal key={day.date}>
            <div>
              <div className="flex items-baseline gap-3 border-b border-gold/45 pb-2">
                <h3 className="font-display text-2xl text-kumkum">{day.day}</h3>
                <p className="tnum label text-ink-soft">{day.date}</p>
              </div>
              <p className="mt-2 font-display text-[0.98rem] text-ink-soft italic">{day.place}</p>

              <ul className="mt-5">
                {day.items.map((item) =>
                  item.featured ? (
                    <li key={item.name} className="my-6">
                      <div className="rule-double grain relative bg-kumkum/[0.06] px-5 py-6">
                        <p className="label text-kumkum-light">Muhurtham</p>
                        <p className="tnum mt-2 font-display text-[3rem] leading-none font-light text-kumkum">
                          {item.time}
                        </p>
                        <h4 className="mt-3 font-display text-2xl text-ink">{item.name}</h4>
                        <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">{item.note}</p>
                      </div>
                    </li>
                  ) : (
                    <li
                      key={item.name}
                      className="dots grid grid-cols-[5.25rem_1fr] gap-x-3 py-4 first:border-t-0 sm:grid-cols-[6.5rem_1fr] sm:gap-x-5"
                    >
                      <p className="tnum pt-1 text-[0.75rem] font-medium tracking-[0.12em] text-gold uppercase">
                        {item.time}
                      </p>
                      <div>
                        <h4 className="font-display text-xl leading-snug text-ink">{item.name}</h4>
                        <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-soft">{item.note}</p>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <figure>
          <div className="relative overflow-hidden">
            <img
              src={sadhya}
              alt="A wedding sadhya laid out on a banana leaf"
              className="h-52 w-full object-cover sm:h-64"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stage/45 via-transparent to-transparent" />
          </div>
          <figcaption className="mt-3 text-center font-display text-lg text-ink-soft italic">
            Sadhya on banana leaf, Saturday at half past twelve
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Invitation body                                                    */
/* ------------------------------------------------------------------ */

function Invocation() {
  return (
    <section className="pt-14 text-center">
      <Reveal>
        <p className="font-deva text-[1.15rem] leading-[2] text-ink">
          मङ्गलं भगवान् विष्णुः, मङ्गलं गरुडध्वजः ।
          <br />
          मङ्गलं पुण्डरीकाक्षः, मङ्गलाय तनो हरिः ॥
        </p>
        <p className="mx-auto mt-5 max-w-md font-display text-lg leading-relaxed text-kumkum italic">
          “All that is auspicious is Vishnu, whose banner is Garuda, whose eyes are the
          lotus — may Hari hold this hour and make it blessed.”
        </p>
        <p className="label mt-5 text-ink-soft">A mangala shloka, recited before the muhurtham</p>
      </Reveal>
    </section>
  );
}

function Families() {
  return (
    <section className="pt-16">
      <Reveal>
        <p className="text-center font-display text-xl leading-relaxed text-ink">
          Smt. <span className="font-medium">Lakshmi</span> &amp; Sri{" "}
          <span className="font-medium">R. Ramamurthy</span> of Adyar, Chennai, and Smt.{" "}
          <span className="font-medium">Vasanthi</span> &amp; Sri{" "}
          <span className="font-medium">V. Srinivasan</span> of Coimbatore
        </p>
        <p className="mx-auto mt-4 max-w-sm text-center text-[0.9rem] leading-relaxed text-ink-soft">
          request the pleasure of your company at the wedding of their children, and ask
          that you come early, eat well, and stay long.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-px bg-gold/30">
        <div className="bg-paper px-3 py-6 text-center">
          <p className="label text-gold">The bride</p>
          <p className="mt-3 font-display text-3xl text-kumkum">Aadhira</p>
          <p className="mt-1 font-tamil text-[1.05rem] text-ink-soft">ஆதிரா</p>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
            Daughter of Lakshmi &amp; Ramamurthy
            <br />
            Adyar, Chennai
          </p>
        </div>
        <div className="bg-paper px-3 py-6 text-center">
          <p className="label text-gold">The groom</p>
          <p className="mt-3 font-display text-3xl text-kumkum">Karthikeya</p>
          <p className="mt-1 font-tamil text-[1.05rem] text-ink-soft">கார்த்திகேயா</p>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
            Son of Vasanthi &amp; Srinivasan
            <br />
            Coimbatore
          </p>
        </div>
      </div>
    </section>
  );
}

function Venue() {
  return (
    <section id="venue" className="scroll-mt-8 pt-16">
      <Heading
        tamil="இடம்"
        label="Where to find us"
        title="Sri Karpaga Vinayagar Kalyana Mandapam"
        tone="kumkum"
      />
      <Reveal className="mt-8">
        <address className="text-center font-display text-xl leading-relaxed text-ink not-italic">
          3rd Cross Street, Indira Nagar
          <br />
          Adyar, Chennai 600 020
        </address>
        <p className="mx-auto mt-4 max-w-xs text-center text-[0.86rem] leading-relaxed text-ink-soft">
          Parking behind the hall on 4th Avenue. Thirty minutes from Nungambakkam if you
          leave before nine.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Indira+Nagar%2C+Adyar%2C+Chennai+600020"
            target="_blank"
            rel="noreferrer"
            className="label bg-kumkum px-6 py-3 text-paper transition-colors hover:bg-kumkum-dark"
          >
            Get directions
          </a>
          <a
            href="tel:+914424400000"
            className="label border border-gold/60 px-6 py-3 text-kumkum transition-colors hover:bg-paper-deep"
          >
            Call the hall
          </a>
        </div>
        <p className="mt-8 text-center font-display text-lg text-ink-soft italic">
          Rooms are held at Hotel Adyar Park until 31 October — mention the
          Ramamurthy–Srinivasan wedding.
        </p>
      </Reveal>
    </section>
  );
}

export default function Invitation() {
  return (
    <div className="relative z-20 mx-auto -mt-10 max-w-[40rem] px-4 pb-10 sm:px-6">
      <div className="rule-double grain relative bg-paper px-5 pb-12 pt-16 sm:px-10">
        <CornerFlourish className="absolute left-2.5 top-2.5 h-8 w-8" />
        <CornerFlourish className="absolute right-2.5 top-2.5 h-8 w-8 rotate-90" />
        <CornerFlourish className="absolute bottom-2.5 right-2.5 h-8 w-8 rotate-180" />
        <CornerFlourish className="absolute bottom-2.5 left-2.5 h-8 w-8 -rotate-90" />

        <Reveal>
          <figure>
            <img
              src={thali}
              alt="Turmeric, kumkum, jasmine and a brass plate on handmade paper"
              className="h-36 w-full object-cover object-left sm:h-44"
            />
            <figcaption className="mt-4 text-center">
              <p className="font-tamil text-[1.4rem] text-kumkum">திருமண அழைப்பு</p>
              <p className="label mt-2 text-ink-soft">An invitation to the wedding of</p>
            </figcaption>
          </figure>
        </Reveal>

        <Countdown />
        <Divider className="mx-auto mt-12 h-6 w-full max-w-xs" />
        <Invocation />
        <Families />
        <Ceremonies />
        <Venue />

        <Divider className="mx-auto mt-14 h-6 w-full max-w-xs" />
      </div>
    </div>
  );
}
