// English modules, add-ons and terms. Same ids and order as ./offer.he.ts.
// The same shekel amounts as Hebrew (change request 26), from the shared numbers in ./prices.ts.
import type { Addon, Module, Offer, Term } from './offer';
import { CONNECT_EXAMPLE, CONNECT_PERCENT, EXTRA_HOUR, OFFICIAL_WHATSAPP_FEE, REFERRAL_CREDIT, money } from './prices';

const ils = (n: number) => money(n, 'en');

const MODULES: Module[] = [
  {
    id: 'phone',
    icon: 'phone',
    name: 'Phone answering',
    limits: [
      'One phone number',
      'Up to 5 branches (a phone menu or topics the bot recognizes)',
      'Script and information for the bot: up to one page',
      'Routing by business hours',
      'Call summary by email to one address',
      'No connection to an external system (a connection is an add-on)',
    ],
  },
  {
    id: 'whatsapp',
    icon: 'chat',
    name: 'WhatsApp',
    limits: [
      'One number, unofficial',
      'Up to 5 flows or menu options',
      'Up to 20 common questions and answers',
      "Leads forwarded to the business owner's email or WhatsApp",
      'Connection to the CRM the business already has, and complete actions directly from WhatsApp',
    ],
  },
  {
    id: 'crm',
    icon: 'db',
    name: 'CRM / ERP system to run your business',
    limits: [
      'Up to 3 entities (for example: customers, leads, appointments or orders)',
      'Up to 15 fields per entity',
      'Up to 5 screens, up to 3 users, one dashboard',
      "Payments through a provider from Tech-shure's approved list",
      'Another provider of your choice, with a complex integration, involves an additional fee',
    ],
  },
  {
    id: 'landing',
    icon: 'layout',
    name: 'Landing page',
    limits: ['One page', 'Up to 6 content sections', 'A contact form', 'Mobile-friendly'],
  },
  {
    id: 'email',
    icon: 'mail',
    name: 'Email automation',
    limits: ['Up to 3 triggers or templates'],
  },
];

const ADDONS: Addon[] = [
  {
    icon: 'grid',
    title: 'Special pricing when you choose several packages',
    text: "Choosing more than one technology? We'll put together a great-value offer for the whole package, in the scoping call.",
  },
  {
    icon: 'sync',
    title: 'Connecting systems',
    text: `An add-on of ${CONNECT_PERCENT} of the monthly payment of the more expensive product of the two.`,
    example: `Phone answering + a connection to an existing CRM = ${ils(CONNECT_EXAMPLE.monthly)} a month`,
    note: 'Condition: the existing system has a documented API. Without a documented API, the price is set by the specification. With the WhatsApp AI Agent, connecting to the CRM you already have is part of the product.',
  },
  {
    icon: 'shield',
    title: 'Official WhatsApp (Meta API)',
    text: `You provide the API through an authorized provider, or pay an additional ${ils(OFFICIAL_WHATSAPP_FEE)}.`,
    note: 'Tech-shure is not responsible for a number being blocked by Meta, for any reason.',
  },
];

const TERMS: Term[] = [
  {
    icon: 'clock',
    title: 'One change hour every month',
    text: 'The monthly payment includes one change hour a month. Unused time does not carry over to the next month.',
  },
  { icon: 'gear', title: 'Additional work hour', text: `${ils(EXTRA_HOUR)} an hour.` },
  {
    icon: 'check',
    title: 'What the monthly payment includes',
    text: 'Operation, issue handling, maintenance of servers and integrations, and one change hour.',
  },
  {
    icon: 'bell',
    title: 'Limited-time launch price',
    text: 'The prices shown on the site are valid for a limited time.',
  },
  {
    icon: 'card',
    title: 'Payment',
    text: 'Monthly payments only, with no setup fee. Work starts after the first monthly payment.',
  },
  {
    icon: 'calendar',
    title: 'Delivery time',
    text: 'A product in the standard scope: within 30 days of payment and approval of the specification, and sometimes sooner. An extended product: according to the specification.',
  },
  {
    icon: 'file',
    title: 'Commitment',
    text: 'A minimum of 12 months.',
  },
  {
    icon: 'chip',
    title: 'Third-party costs',
    text: 'Servers, AI tools and call minutes are not included in the price. They are charged directly to your credit card, and you receive an estimate in advance. If AI or token costs rise worldwide, the cost rises accordingly.',
  },
  {
    icon: 'list',
    title: 'Changes beyond the specification',
    text: 'A change that was not in the specification is priced separately.',
  },
  {
    icon: 'signal',
    title: 'Ending the engagement',
    text: 'Tech-shure may switch off the system with 30 days of advance notice. The system, the code and the infrastructure are owned by Tech-shure.',
  },
  {
    icon: 'gift',
    title: 'Refer a friend',
    text: `Once your friend has signed a contract and paid the first monthly payment, you choose one: a landing page (hosting and usage costs are yours), a consulting hour, or a ${ils(REFERRAL_CREDIT)} credit.`,
  },
];

const PRICE_NOTE = 'Pricing is for small and medium businesses and depends on the specification. A broader product is priced accordingly.';

export const OFFER_EN: Offer = { modules: MODULES, addons: ADDONS, terms: TERMS, priceNote: PRICE_NOTE };
