// Launch prices in shekels: the single numeric source for both languages, on the site and in the chat bot
// (api/_chat-prompt.ts, api/_chat-prompt-en.ts). Keep in sync with rebrand/business-model.md.
// Free of React and browser code, so the api functions can import it.

export type Price = { setup: number; monthly: number };

/** Launch price of each product with a fixed price (setup once, then monthly). */
export const PRODUCT_PRICES = {
  phone: { setup: 2500, monthly: 250 },
  whatsapp: { setup: 2500, monthly: 250 },
  crm: { setup: 2500, monthly: 250 },
  /** Landing page, or email automation. */
  landing: { setup: 1250, monthly: 125 },
} satisfies Record<string, Price>;

/** The monthly amount quoted on the home page. */
export const HOME_MONTHLY = PRODUCT_PRICES.phone.monthly;

/** An additional work hour. */
export const EXTRA_HOUR = 250;

/** Official WhatsApp (Meta API) when the client does not provide the API. */
export const OFFICIAL_WHATSAPP_FEE = 2000;

/** The "refer a friend" credit. */
export const REFERRAL_CREDIT = 250;

/** The AI consulting day (a fixed price, not a launch price). */
export const AI_DAY = 1000;

/** Connecting systems: this share of the more expensive product, on the setup and the monthly payment. */
export const CONNECT_RATE = 0.5;
export const CONNECT_PERCENT = `${CONNECT_RATE * 100}%`;

/** Example: phone answering + a connection to an existing CRM. */
export const CONNECT_EXAMPLE: Price = {
  setup: PRODUCT_PRICES.phone.setup * (1 + CONNECT_RATE),
  monthly: PRODUCT_PRICES.phone.monthly * (1 + CONNECT_RATE),
};

/** The amount alone, with the en-US thousands separator: 3750 -> "3,750". */
export const amount = (n: number) => n.toLocaleString('en-US');

/** A shekel amount: "3,750 ₪" in Hebrew, "₪3,750" in English. */
export const money = (n: number, lang: 'he' | 'en' = 'he') => (lang === 'en' ? `₪${amount(n)}` : `${amount(n)} ₪`);
