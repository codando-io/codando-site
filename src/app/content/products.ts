import { ProductStatus } from '../ui/status-chip/status-chip';

/** A product with a public app and public source code. */
export interface Product {
  readonly name: string;
  readonly status: ProductStatus;
  readonly category: string;
  readonly description: string;
  readonly note?: string;
  readonly appUrl: string;
  readonly sourceUrl: string;
}

export const PRODUCTS: readonly Product[] = [
  {
    name: 'Agora',
    status: 'live',
    category: 'Federated chat, voice, and video',
    description:
      'A client for community chat built on the open Matrix protocol, organized into spaces and rooms the way Discord users expect. Agora connects to any Matrix server and brings text rooms and always-on voice rooms together in the browser.',
    appUrl: 'https://agora.capivaras.dev',
    sourceUrl: 'https://src.capivaras.dev/capivaras/agora',
  },
  {
    name: 'Cenaculum',
    status: 'live',
    category: 'Screen-sharing rooms',
    description:
      'Screen-sharing rooms for friends. Open a link, choose a nickname, and share or watch, with no account and nothing to install. Anyone in the room can draw over the shared screen.',
    note: 'Open source under the MIT License.',
    appUrl: 'https://cenaculum.capivaras.dev',
    sourceUrl: 'https://src.capivaras.dev/capivaras/cenaculum',
  },
];
