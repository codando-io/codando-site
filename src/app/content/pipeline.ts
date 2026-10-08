export interface PipelineStage {
  readonly title: string;
  readonly items: readonly { readonly name: string; readonly description: string }[];
}

export const PIPELINE: readonly PipelineStage[] = [
  {
    title: 'Public sources',
    items: [
      {
        name: 'Electoral data',
        description: 'Candidates, results, and votes by municipality, from the TSE’s open data.',
      },
      {
        name: 'Campaign finances',
        description: 'Donations, contracted expenses, and payments declared by campaigns.',
      },
      {
        name: 'Candidate government plans',
        description: 'The official PDFs filed with the TSE, kept exactly as published.',
      },
      {
        name: 'Public records',
        description:
          'The federal company register, sanction lists from the Office of the Comptroller General, and public contracts from the National Public Procurement Portal.',
      },
    ],
  },
  {
    title: 'Analysis',
    items: [
      {
        name: 'Structured data model',
        description: 'Records joined by official identifiers, never by name alone.',
      },
      {
        name: 'Document analysis',
        description:
          'Government plans read page by page, with OCR for scanned pages and an index of headings and topics.',
      },
      {
        name: 'Entity and relationship extraction',
        description:
          'Donors, suppliers, parties, and candidates connected in a relationship graph.',
      },
      {
        name: 'Change tracking',
        description:
          'Each new TSE publication is compared with the last, so added, changed, and removed transactions stay visible.',
      },
    ],
  },
  {
    title: 'Exploration',
    items: [
      {
        name: 'Search and exploration',
        description:
          'Candidate profiles, money flows, donor and supplier explorers, party and state views, and a transaction explorer with CSV export.',
      },
      {
        name: 'Source traceability',
        description:
          'A path from any figure to the underlying transactions and the official source.',
      },
    ],
  },
];
