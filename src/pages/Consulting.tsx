import { Contact } from '../components/Contact';
import { ContactLink, Faq, FlowCard, Hero, Reveal, Section, SectionHead } from '../components/Blocks';

const PAINS: { title: string; text: string }[] = [
  { title: 'עובד בדמו, נשבר בענן', text: 'האב-טיפוס רץ יפה אצלכם. ברגע שהוא עולה לענן עם משתמשים אמיתיים, משהו קורס.' },
  { title: 'הרבה משתמשים בבת אחת', text: 'סקיילינג חושף צווארי בקבוק שלא רואים בדמו: תורים, מסד נתונים, וזמן תגובה.' },
  { title: 'ביצועים וחשבונית', text: 'המערכת איטית, וחשבון הענן גדל בלי שברור מה באמת עולה כסף.' },
  { title: 'בלי רשת ביטחון', text: 'סודות בקוד, בלי גיבויים, בלי ניטור, ושגיאות שנעלמות עד שלקוח מתלונן.' },
];

const TRACKS: { hue: string; kicker: string; title: string; text: string; items: string[] }[] = [
  {
    hue: 'web',
    kicker: 'CONSULTING',
    title: 'ייעוץ',
    text: 'נכנסים למערכת הקיימת ויוצאים עם תמונה ברורה: מה שבור, מה דחוף, ומה לעשות קודם.',
    items: [
      'סקירת ארכיטקטורה וסקיילינג בענן',
      'בדיקות אבטחה וביקורת',
      'תוכנית יציבות: ניטור, גיבויים וטיפול בשגיאות',
      'מפת עלויות וביצועים, לפי סדר עדיפויות',
    ],
  },
  {
    hue: 'flow',
    kicker: 'EXECUTION',
    title: 'ביצוע',
    text: 'לא רק דוח. לוקחים את האב-טיפוס ומביאים אותו לפרודקשן שאפשר לסמוך עליו.',
    items: [
      'העברת מערכת שנבנתה בכלי AI לייצור',
      'הקשחה, ניטור, גיבויים וטיפול בשגיאות בפועל',
      'שיפור ביצועים והורדת עלויות ענן',
      'עלייה לאוויר עם עומס משתמשים אמיתי',
    ],
  },
];

const STEPS = [
  { title: 'אבחון', text: 'שיחה על המערכת, הכלים שבהם נבנתה, והעומס שאתם מצפים לו.' },
  { title: 'סקירה', text: 'ארכיטקטורה, אבטחה, ביצועים ועלויות. על הקוד שכבר קיים.' },
  { title: 'מסלול', text: 'ייעוץ עם תוכנית עבודה, או ביצוע עד שהמערכת עומדת בפרודקשן.' },
  { title: 'יציבות', text: 'ניטור, גיבויים, ואחריות גם אחרי העלייה לאוויר.' },
];

const FAQ = [
  { q: 'בנינו עם Base44, Claude, Lovable או Cursor. אפשר לעזור?', a: 'כן. אנחנו נכנסים לקוד שכבר נכתב, בכל כלי AI, ולא מתחילים מאפס אם אין בכך צורך.' },
  { q: 'אפשר רק ייעוץ, בלי שתכתבו קוד?', a: 'כן. מקבלים סקירה ומפת דרכים, ואפשר לעצור שם. ביצוע הוא מסלול נפרד.' },
  { q: 'כמה זמן זה לוקח?', a: 'סקירה ממוקדת בדרך כלל תוך ימים. מעבר מלא לפרודקשן תלוי בגודל המערכת ונקבע אחרי האבחון.' },
  { q: 'הקוד נשאר שלנו?', a: 'כן. הקוד, הדומיין והנתונים נשארים בבעלותכם.' },
];

export default function Consulting() {
  return (
    <>
      <Hero
        tag="Cloud · Scale · Production"
        title="ייעוץ ו-QA"
        accent="לענן שעובד."
        sub="Built fast with AI. Made to survive production."
        lead="הרבה מערכות נבנות היום עם Base44, Claude, Lovable, Cursor וכלים דומים. הן רצות יפה בדמו, ואז מגיעות לענן: הרבה משתמשים, עלויות, אבטחה ועומס. Tech-Shure נכנסת כאן. ייעוץ, או ביצוע, עד שהמערכת יציבה בפרודקשן."
        cta="דברו איתנו על המערכת"
        checks={['סקירת ארכיטקטורה', 'בדיקות אבטחה', 'ניטור וגיבויים', 'מעבר לפרודקשן']}
        visual={
          <FlowCard
            label="path: prototype-to-production"
            steps={[
              { icon: 'chip', title: 'אב-טיפוס נבנה בכלי AI', text: 'Base44, Claude, Lovable, Cursor ועוד' },
              { icon: 'signal', title: 'עולה לענן ונשבר בעומס', text: 'משתמשים, ביצועים וחשבונית' },
              { icon: 'shield', title: 'סקירה: ארכיטקטורה ואבטחה', text: 'מה לתקן קודם, ומה עולה כסף' },
              { icon: 'chart', title: 'פרודקשן יציב', text: 'ניטור, גיבויים וטיפול בשגיאות' },
            ]}
          />
        }
      />

      <Section>
        <SectionHead
          kicker="WHERE IT BREAKS"
          title="איפה מערכות AI נשברות"
          lead="הכלי בנה מהר. הענן הוא המבחן."
        />
        <div className="grid grid--steps">
          {PAINS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="problem">
              <div className="problem-title">{p.title}</div>
              <div className="problem-text">{p.text}</div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="tracks" tone="white">
        <SectionHead
          kicker="TWO WAYS IN"
          title="שני מסלולים. אותה אחריות."
          lead="אפשר לעצור בייעוץ, או להמשיך לביצוע. בשני המקרים אתם מדברים עם מי שסוקר ובונה."
        />
        <div className="grid grid--wide">
          {TRACKS.map((track, i) => (
            <Reveal key={track.title} delay={i * 80}>
              <article className={`card card--info hue--${track.hue}`}>
                <span className="kicker mono" dir="ltr">{track.kicker}</span>
                <h2>{track.title}</h2>
                <p className="card-text">{track.text}</p>
                <ul className="bullets bullets--lg">
                  {track.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="process">
        <SectionHead kicker="HOW IT WORKS" title="מהשיחה לפרודקשן יציב" />
        <ol className="grid grid--steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 90} className="step">
                <span className="step-num mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Faq items={FAQ} />

      <section className="cta-band">
        <div className="container cta-band-inner">
          <h2>יש לכם מערכת AI שצריכה להחזיק מעמד בענן?</h2>
          <ContactLink className="btn btn-dark btn-lg">צור קשר</ContactLink>
        </div>
      </section>

      <Contact
        title="בואו נסתכל על המערכת שלכם"
        sub="From AI prototype to a cloud that holds."
        defaultService="ייעוץ ענן / מעבר לפרודקשן"
      />
    </>
  );
}
