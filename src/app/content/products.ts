import { ProductStatus } from '../ui/status-chip/status-chip';

/** A product as the hero's status board lists it, linking to the section that describes it. */
export interface ProductSummary {
  readonly name: string;
  readonly category: string;
  readonly status: ProductStatus;
  readonly href: `#${string}`;
}

/** A live product with a public app and public source code. */
export interface LiveProduct extends ProductSummary {
  readonly status: 'live';
  readonly description: string;
  readonly note?: string;
  readonly appUrl: string;
  readonly sourceUrl: string;
}

export const PRUMO: ProductSummary = {
  name: 'Prumo',
  category: 'Electoral transparency',
  status: 'in-development',
  href: '#prumo',
};

export const LIVE_PRODUCTS: readonly LiveProduct[] = [
  {
    name: 'Agora',
    category: 'Federated chat, voice, and video',
    status: 'live',
    href: '#products',
    description:
      'A client for community chat built on the open Matrix protocol, organized into spaces and rooms the way Discord users expect. Agora connects to any Matrix server and brings text rooms and always-on voice rooms together in the browser.',
    appUrl: 'https://agora.capivaras.dev',
    sourceUrl: 'https://src.capivaras.dev/capivaras/agora',
  },
  {
    name: 'Cenaculum',
    category: 'Screen-sharing rooms',
    status: 'live',
    href: '#products',
    description:
      'Screen-sharing rooms for friends. Open a link, choose a nickname, and share or watch, with no account and nothing to install. Anyone in the room can draw over the shared screen.',
    note: 'Open source under the MIT License.',
    appUrl: 'https://cenaculum.capivaras.dev',
    sourceUrl: 'https://src.capivaras.dev/capivaras/cenaculum',
  },
];

/** Every product, in the order the status board lists them. */
export const PRODUCTS: readonly ProductSummary[] = [PRUMO, ...LIVE_PRODUCTS];
