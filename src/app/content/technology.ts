export interface TechConcept {
  readonly title: string;
  readonly description: string;
}

export const TECH_CONCEPTS: readonly TechConcept[] = [
  {
    title: 'Artificial intelligence',
    description:
      'The next stage of Prumo: language models for reading and summarizing long public documents, with every generated passage labeled and linked to its source.',
  },
  {
    title: 'Document analysis',
    description:
      'Text extracted from official PDFs page by page, with OCR for scanned pages and an index to navigate them.',
  },
  {
    title: 'Data processing',
    description:
      'Incremental pipelines that download, convert, and model official open data, and record what changed between publications.',
  },
  {
    title: 'Structured data',
    description:
      'Records joined by official identifiers, never by name alone, so every view can be traced to its source.',
  },
  {
    title: 'Modern web applications',
    description: 'Fast, accessible interfaces, from real-time communication to data exploration.',
  },
  {
    title: 'Reproducible infrastructure',
    description: 'Services deployed from versioned, declarative configurations.',
  },
];

export const STACK: readonly string[] = [
  'TypeScript',
  'Next.js and React',
  'Angular',
  'Node.js',
  'DuckDB',
  'ECharts',
  'WebRTC and LiveKit',
  'Matrix',
  'NixOS',
];
