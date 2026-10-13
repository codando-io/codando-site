import { Feature } from '../sections/feature-list/feature-list';

export const CAPABILITIES: readonly Feature[] = [
  {
    title: 'Web applications',
    description: 'Fast, accessible interfaces built with TypeScript, Angular, React, and Next.js.',
  },
  {
    title: 'Real-time communication',
    description:
      'Voice, video, and screen sharing over WebRTC and LiveKit, and federated chat over Matrix.',
  },
  {
    title: 'Public data pipelines',
    description:
      'Official open data downloaded, cleaned, and modeled with DuckDB, with every change between publications recorded.',
  },
  {
    title: 'Infrastructure',
    description:
      'Services deployed from versioned NixOS configurations, on servers Codando runs itself.',
  },
];

/** The stack used across the products, in the order the page lists it. */
export const STACK: readonly string[] = [
  'TypeScript',
  'Angular',
  'Next.js',
  'React',
  'Node.js',
  'DuckDB',
  'ECharts',
  'WebRTC',
  'LiveKit',
  'Matrix',
  'NixOS',
];
