import { useEffect, useState } from "react";
import sadhya from "../assets/sadhya.jpg";
import thali from "../assets/thali.jpg";
import ganeshaGold from "../assets/ganesha-gold.png";
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

function Cell({
  value,
  teluguUnit,
  unit,
}: {
  value: number;
  teluguUnit: string;
  unit: string;
}) {
  return (
    <div className="flex-1 px-1 text-center">
      <p className="tnum font-display text-[2.6rem] leading-none font-light text-kumkum sm:text-[3.2rem]">
        {String(value).padStart(2, "0")}
      </p>
      <p className="font-telugu mt-1 text-[0.82rem] leading-none text-ink-soft font-medium">
        {teluguUnit}
      </p>
      <p className="label text-[0.62rem] text-ink-soft/75">{unit}</p>
    </div>
  );
}

function Countdown() {
  const c = useCountdown(MUHURTHAM);
  return (
    <section className="pt-12 sm:pt-16">
      <p className="font-telugu text-center text-lg font-medium text-kumkum">
        {c.past ? "మాంగల్యధారణ మహోత్సవం సంపూర్ణమైనది" : "జీలకర్ర బెల్లం & మాంగల్యధారణ ముహూర్తం"}
      </p>
      <p className="label mt-1 text-center text-gold">
        {c.past ? "The mangalyam has been tied" : "Until the auspicious muhurtham"}
      </p>
      {c.past ? (
        <p className="mx-auto mt-5 max-w-sm text-center font-display text-2xl leading-snug text-ink italic">
          Thank you for standing with us in the hour of 10:48. Your blessings are the
          only gift that lasts.
        </p>
      ) : (
        <div className="mt-6 flex items-stretch divide-x divide-gold/35">
          <Cell value={c.days} teluguUnit="రోజులు" unit="days" />
          <Cell value={c.hours} teluguUnit="గంటలు" unit="hours" />
          <Cell value={c.minutes} teluguUnit="నిమిషాలు" unit="minutes" />
          <Cell value={c.seconds} teluguUnit="సెకన్లు" unit="seconds" />
        </div>
      )}
      <div className="mt-6 text-center">
        <p className="font-telugu text-[0.98rem] text-ink-soft">
          రోహిణి నక్షత్రం · ఉదయం 10:48 నుండి 11:32 వరకు
        </p>
        <p className="tnum mt-0.5 font-display text-base text-ink-soft/80">
          Rohini nakshatram · 10:48 – 11:32 in the forenoon
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Ceremonies                                                         */
/* ------------------------------------------------------------------ */

type Item = {
  time: string;
  nameTelugu: string;
  name: string;
  noteTelugu: string;
  note: string;
  featured?: boolean;
};

const DAYS: {
  dayTelugu: string;
  day: string;
  date: string;
  placeTelugu: string;
  place: string;
  items: Item[];
}[] = [
  {
    dayTelugu: "శుక్రవారం",
    day: "Friday",
    date: "20 November 2026",
    placeTelugu: "వధువు నివాసం, తిరుపతి, ఆంధ్రప్రదేశ్",
    place: "The bride's home, Tirupati, Andhra Pradesh",
    items: [
      {
        time: "06:00 PM",
        nameTelugu: "వ్రతం & స్నాతకం",
        name: "Vratham",
        noteTelugu: "శుభకార్యారంభం. దీపారాధన, కలశ స్థాపన మరియు వ్రత పూజా కార్యక్రమాలు.",
        note: "The households set the day's work aside. A lamp is lit, the kudam is set, and the fast of the vratham begins.",
      },
      {
        time: "07:30 PM",
        nameTelugu: "నలుగు & సంగీత్",
        name: "Nalugu",
        noteTelugu: "పసుపు కుంకుమలు, సంప్రదాయ నలుగు, మంగళ గీతాలు మరియు కుటుంబ సభ్యుల ఆటపాటలు.",
        note: "Turmeric, teasing and traditional songs played between bride and groom, sung by the women of both families.",
      },
    ],
  },
  {
    dayTelugu: "శనివారం",
    day: "Saturday",
    date: "21 November 2026",
    placeTelugu: "శ్రీ వేంకటేశ్వర కళ్యాణ మండపం, అలిపిరి బైపాస్ రోడ్, తిరుపతి, ఆంధ్రప్రదేశ్",
    place: "Sri Venkateswara Kalyana Mandapam, Alipiri Bypass Road, Tirupati, Andhra Pradesh",
    items: [
      {
        time: "07:00 AM",
        nameTelugu: "జానవాసం & కాశీ యాత్ర",
        name: "Janavasakam & Kashi Yatra",
        noteTelugu: "మండపం వద్ద వరుడికి దీప హారతులతో స్వాగతం, సాంప్రదాయ కాశీ యాత్ర మరియు ఎదుర్కొలు.",
        note: "Karthikeya is received at the hall gate with a lit lamp, then sets off mock-seriously for Kashi and is turned back by the bride's father.",
      },
      {
        time: "08:30 AM",
        nameTelugu: "పూలమాల మార్పిడి",
        name: "Maalai Maatral",
        noteTelugu: "మంగళ వాయిద్యాల నడుమ వధూవరుల మధ్య మూడు సార్లు పూలమాలల మార్పిడి.",
        note: "Garlands are exchanged three times — each family lifting their own a little higher each time.",
      },
      {
        time: "09:30 AM",
        nameTelugu: "ఊంజల్ (ఉయ్యాల సేవ)",
        name: "Oonjal",
        noteTelugu: "అలంకరించిన ఊంజల్ లో వధూవరుల కూర్పు, పెద్దల ఆశీస్సులు మరియు మంగళ హారతులు.",
        note: "The swing is hung. Coloured rice is thrown to the four directions and the couple is rocked gently while the elders sing.",
      },
      {
        time: "10:48 AM",
        nameTelugu: "జీలకర్ర బెల్లం & మాంగల్య ధారణం",
        name: "Mangalya Dharanam",
        noteTelugu: "రోహిణి నక్షత్ర యుక్త సుముహూర్తమున ఉదయం 10:48 గంటలకు మాంగల్యధారణం. దయచేసి ఉదయం 10:30 గంటలకే కళ్యాణ వేదిక వద్ద ఆసీనులు కాగలరు.",
        note: "The mangalyam is tied at 10:48 AM during Rohini nakshatram and the hour closes at 11:32. Please be seated in the hall by 10:30 AM.",
        featured: true,
      },
      {
        time: "11:45 AM",
        nameTelugu: "సప్తపది & తలంబ్రాలు",
        name: "Saptapadi & Talambralu",
        noteTelugu: "అగ్నిసాక్షిగా ఏడడుగులు, హోమ కార్యక్రమం మరియు ముత్యాల తలంబ్రాల వేడుక.",
        note: "Seven steps taken around the sacred fire, parched rice offered to Agni, and the auspicious shower of talambralu.",
      },
      {
        time: "12:30 PM",
        nameTelugu: "కళ్యాణ విందు భోజనం",
        name: "Traditional Feast / Sadhya",
        noteTelugu: "అరటి ఆకులో వడ్డించే సంప్రదాయ షడ్రసోపేత విందు భోజనం.",
        note: "The wedding feast, served on a banana leaf. Start at the left, the salt goes at the top, and leave a little space for the payasam.",
      },
    ],
  },
  {
    dayTelugu: "ఆదివారం",
    day: "Sunday",
    date: "22 November 2026",
    placeTelugu: "శ్రీ వేంకటేశ్వర కళ్యాణ మండపం, తిరుపతి, ఆంధ్రప్రదేశ్",
    place: "Sri Venkateswara Kalyana Mandapam, Tirupati, Andhra Pradesh",
    items: [
      {
        time: "11:00 AM",
        nameTelugu: "గృహప్రవేశం",
        name: "Grihapravesham",
        noteTelugu: "తిరుపతిలో నూతన వధువుకు దీపకళశాలతో సాదర స్వాగతం.",
        note: "Aadhira is welcomed at the threshold in Tirupati with a lamp and auspicious blessings — for the families.",
      },
      {
        time: "07:00 PM",
        nameTelugu: "వివాహ సత్కారం & విందు",
        name: "Reception & Dinner",
        noteTelugu: "సంగీత సంధ్య మరియు విందు భోజనం. ద్వారాలు సాయంత్రం 7:00 గంటలకు తెరవబడతాయి, విందు 8:30 గంటల నుండి.",
        note: "An evening of music, filter coffee and dinner. Doors open at 07:00 PM, dinner served from 08:30 PM.",
      },
    ],
  },
];

function Ceremonies() {
  return (
    <section id="ceremonies" className="scroll-mt-8 pt-16 sm:pt-20">
      <Heading
        telugu="కార్యక్రమ వివరాలు"
        label="Order of ceremonies"
        title="Three days, from lamp to feast"
      />
      <div className="mt-12 space-y-14">
        {DAYS.map((day) => (
          <Reveal key={day.date}>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-gold/45 pb-2">
                <h3 className="font-telugu text-xl font-medium text-kumkum">
                  {day.dayTelugu}
                </h3>
                <span className="font-display text-2xl text-kumkum/85">
                  ({day.day})
                </span>
                <p className="tnum label text-ink-soft ml-auto">{day.date}</p>
              </div>
              <p className="font-telugu mt-2 text-[0.92rem] text-ink-soft font-normal">
                {day.placeTelugu}
              </p>
              <p className="font-display text-[0.92rem] text-ink-soft/80 italic">
                {day.place}
              </p>

              <ul className="mt-5">
                {day.items.map((item) =>
                  item.featured ? (
                    <li key={item.name} className="my-6">
                      <div className="rule-double grain relative bg-kumkum/[0.06] px-5 py-6">
                        <div className="flex items-center justify-between">
                          <p className="font-telugu text-[0.88rem] font-medium text-kumkum-light">
                            ముహూర్తం
                          </p>
                          <p className="label text-kumkum-light">Muhurtham</p>
                        </div>
                        <p className="tnum mt-2 font-display text-[3rem] leading-none font-light text-kumkum">
                          {item.time}
                        </p>
                        <h4 className="mt-3 font-telugu text-2xl text-ink font-medium">
                          {item.nameTelugu}
                        </h4>
                        <p className="font-display text-xl text-ink-soft italic">
                          {item.name}
                        </p>
                        <p className="font-telugu mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
                          {item.noteTelugu}
                        </p>
                        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink-soft/85">
                          {item.note}
                        </p>
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
                        <h4 className="font-telugu text-lg leading-snug font-medium text-ink">
                          {item.nameTelugu}
                        </h4>
                        <p className="font-display text-base text-ink-soft italic">
                          {item.name}
                        </p>
                        <p className="font-telugu mt-1 text-[0.85rem] leading-relaxed text-ink-soft">
                          {item.noteTelugu}
                        </p>
                        <p className="mt-1 text-[0.84rem] leading-relaxed text-ink-soft/80">
                          {item.note}
                        </p>
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
              alt="A wedding sadhya feast laid out on a banana leaf"
              className="h-52 w-full object-cover sm:h-64"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stage/45 via-transparent to-transparent" />
          </div>
          <figcaption className="mt-3 text-center">
            <p className="font-telugu text-base text-ink-soft">
              అరటి ఆకులో కళ్యాణ విందు భోజనం, శనివారం మధ్యాహ్నం 12:30 గంటలకు
            </p>
            <p className="font-display text-base text-ink-soft/80 italic">
              Traditional feast on banana leaf, Saturday at half past twelve
            </p>
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
        <div className="mx-auto mb-6 flex justify-center">
          <img
            src={ganeshaGold}
            alt="Lord Ganesha"
            className="h-20 w-auto object-contain drop-shadow-[0_6px_20px_rgba(185,138,52,0.35)] filter brightness-[1.02]"
          />
        </div>
        <p className="font-telugu text-[1.18rem] leading-[2.1] text-ink font-normal">
          మంగళం భగవాన్ విష్ణుః, మంగళం గరుడధ్వజః ।
          <br />
          మంగళం పుండరీకాక్షః, మంగళాయ తనో హరిః ॥
        </p>
        <p className="mx-auto mt-5 max-w-md font-display text-lg leading-relaxed text-kumkum italic">
          “All that is auspicious is Vishnu, whose banner is Garuda, whose eyes are the
          lotus — may Hari hold this hour and make it blessed.”
        </p>
        <p className="font-telugu mt-4 text-[0.88rem] text-ink-soft">
          ముహూర్తానికి ముందు పఠించే మంగళ శ్లోకం
        </p>
        <p className="label mt-1 text-ink-soft/80">A mangala shloka, recited before the muhurtham</p>
      </Reveal>
    </section>
  );
}

function Families() {
  return (
    <section className="pt-16">
      <Reveal>
        <p className="font-telugu text-center text-lg leading-relaxed text-ink">
          శ్రీమతి <span className="font-medium">లక్ష్మి</span> &amp; శ్రీ{" "}
          <span className="font-medium">ఆర్. రామమూర్తి</span> (తిరుపతి, ఆంధ్రప్రదేశ్), మరియు శ్రీమతి{" "}
          <span className="font-medium">వాసంతి</span> &amp; శ్రీ{" "}
          <span className="font-medium">వి. శ్రీనివాసన్</span> (తిరుపతి, ఆంధ్రప్రదేశ్)
        </p>
        <p className="mt-2 text-center font-display text-xl leading-relaxed text-ink">
          Smt. <span className="font-medium">Lakshmi</span> &amp; Sri{" "}
          <span className="font-medium">R. Ramamurthy</span> of Tirupati, Andhra Pradesh, and Smt.{" "}
          <span className="font-medium">Vasanthi</span> &amp; Sri{" "}
          <span className="font-medium">V. Srinivasan</span> of Tirupati, Andhra Pradesh
        </p>
        <p className="font-telugu mx-auto mt-4 max-w-md text-center text-[0.95rem] leading-relaxed text-ink-soft">
          వధూవరుల కళ్యాణ మహోత్సవానికి మిమ్మల్ని సకుటుంబ సపరివార సమేతంగా సాదరంగా ఆహ్వానిస్తున్నారు.
        </p>
        <p className="mx-auto mt-1 max-w-sm text-center text-[0.9rem] leading-relaxed text-ink-soft/85">
          request the pleasure of your company at the wedding of their children, and ask
          that you come early, eat well, and stay long.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-px bg-gold/30">
        <div className="bg-paper px-3 py-6 text-center">
          <p className="font-telugu text-[0.88rem] font-medium text-gold">వధువు</p>
          <p className="label text-gold/80">The bride</p>
          <p className="mt-2 font-telugu text-2xl text-kumkum">ఆదిర</p>
          <p className="font-display text-2xl text-kumkum">Aadhira</p>
          <p className="font-telugu mt-3 text-[0.82rem] leading-relaxed text-ink-soft">
            లక్ష్మి &amp; రామమూర్తి ల పుత్రిక
            <br />
            తిరుపతి, ఆంధ్రప్రదేశ్
          </p>
          <p className="mt-1 text-[0.8rem] leading-relaxed text-ink-soft/80">
            Daughter of Lakshmi &amp; Ramamurthy
            <br />
            Tirupati, Andhra Pradesh
          </p>
        </div>
        <div className="bg-paper px-3 py-6 text-center">
          <p className="font-telugu text-[0.88rem] font-medium text-gold">వరుడు</p>
          <p className="label text-gold/80">The groom</p>
          <p className="mt-2 font-telugu text-2xl text-kumkum">కార్తికేయ</p>
          <p className="font-display text-2xl text-kumkum">Karthikeya</p>
          <p className="font-telugu mt-3 text-[0.82rem] leading-relaxed text-ink-soft">
            వాసంతి &amp; శ్రీనివాసన్ ల సుపుత్రుడు
            <br />
            తిరుపతి, ఆంధ్రప్రదేశ్
          </p>
          <p className="mt-1 text-[0.8rem] leading-relaxed text-ink-soft/80">
            Son of Vasanthi &amp; Srinivasan
            <br />
            Tirupati, Andhra Pradesh
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
        telugu="కళ్యాణ వేదిక"
        label="Where to find us"
        title="Sri Venkateswara Kalyana Mandapam"
        tone="kumkum"
      />
      <Reveal className="mt-8">
        <p className="font-telugu text-center text-lg leading-relaxed text-ink font-medium">
          శ్రీ వేంకటేశ్వర కళ్యాణ మండపం
        </p>
        <address className="text-center font-display text-xl leading-relaxed text-ink not-italic">
          Alipiri Bypass Road
          <br />
          Tirupati, Andhra Pradesh 517501
        </address>
        <p className="font-telugu mx-auto mt-4 max-w-sm text-center text-[0.88rem] leading-relaxed text-ink-soft">
          మండపం ప్రాంగణంలో విశాలమైన కార్ పార్కింగ్ సదుపాయం కలదు. అలిపిరి సమీపంలో సులభంగా చేరుకోవచ్చు.
        </p>
        <p className="mx-auto mt-1 max-w-xs text-center text-[0.84rem] leading-relaxed text-ink-soft/85">
          Ample car parking available within the mandapam premises. Conveniently located near Alipiri, Tirupati.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Sri+Venkateswara+Kalyana+Mandapam+Tirupati+Andhra+Pradesh"
            target="_blank"
            rel="noreferrer"
            className="label bg-kumkum px-6 py-3 text-paper transition-colors hover:bg-kumkum-dark"
          >
            దారి చూడండి · Get directions
          </a>
          <a
            href="tel:+918772220000"
            className="label border border-gold/60 px-6 py-3 text-kumkum transition-colors hover:bg-paper-deep"
          >
            మండపం ఫోన్ · Call the hall
          </a>
        </div>
        <div className="mt-8 text-center">
          <p className="font-telugu text-[0.92rem] text-ink-soft">
            హోటల్ బ్లిస్, తిరుపతి నందు అతిథులకు బస కేటాయించబడింది (అక్టోబర్ 31 వరకు).
          </p>
          <p className="mt-1 font-display text-lg text-ink-soft/80 italic">
            Rooms are held at Hotel Bliss, Tirupati until 31 October — mention the
            Ramamurthy–Srinivasan wedding.
          </p>
        </div>
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
              <p className="font-telugu text-[1.45rem] font-medium text-kumkum">
                వివాహ మహోత్సవ ఆహ్వాన పత్రిక
              </p>
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
