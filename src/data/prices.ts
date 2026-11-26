// Prices in shekels: the single numeric source for both languages, on the site and in the chat bot
// (api/_chat-prompt.ts, api/_chat-prompt-en.ts). Keep in sync with rebrand/business-model.md.
// Free of React and browser code, so the api functions can import it.
// Change request 31: products are monthly payments only, with no one-time setup fee.

export type Price = { monthly: number };

/** Limited-time price of each product with a fixed price: a monthly payment only. */
export const PRODUCT_PRICES = {
  phone: { monthly: 399 },
  whatsapp: { monthly: 399 },
  crm: { monthly: 399 },
  /** Landing page, or email automation. No new price was given (change request 31): the existing monthly amount stays. */
  landing: { monthly: 125 },
} satisfies Record<string, Price>;

/** The monthly amount quoted on the home page. */
export const HOME_MONTHLY = PRODUCT_PRICES.phone.monthly;

/** An additional work hour. */
export const EXTRA_HOUR = 250;

/** Official WhatsApp (Meta API) when the client does not provide the API. */
export const OFFICIAL_WHATSAPP_FEE = 2000;

/** The "refer a friend" credit. */
export const REFERRAL_CREDIT = 250;

/** The AI consulting: a one-time characterization and consulting session (a one-time fee, not monthly, not a launch price). */
export const AI_SESSION = 499;

/** Connecting systems: this share of the more expensive product's monthly payment. */
export const CONNECT_RATE = 0.5;
export const CONNECT_PERCENT = `${CONNECT_RATE * 100}%`;

/** Example: phone answering + a connection to an existing CRM, a month (rounded to a whole shekel). */
export const CONNECT_EXAMPLE: Price = {
  monthly: Math.round(PRODUCT_PRICES.phone.monthly * (1 + CONNECT_RATE)),
};

/** The amount alone, with the en-US thousands separator: 3750 -> "3,750". */
export const amount = (n: number) => n.toLocaleString('en-US');

/** A shekel amount: "3,750 ₪" in Hebrew, "₪3,750" in English. */
export const money = (n: number, lang: 'he' | 'en' = 'he') => (lang === 'en' ? `₪${amount(n)}` : `${amount(n)} ₪`);
