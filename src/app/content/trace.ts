/** A highlighted source value and the record built from it share this number. */
export type MarkerNumber = 1 | 2 | 3;

/** One column of the TSE open-data row shown in the hero figure. */
export interface TraceField {
  readonly name: string;
  readonly value: string;
  readonly marker?: MarkerNumber;
}

/** What Prumo builds from a highlighted value, with where the value comes from. */
export interface TraceRecord {
  readonly marker: MarkerNumber;
  readonly type: string;
  readonly value: string;
  readonly provenance: string;
}

export const TRACE_FIELDS: readonly TraceField[] = [
  { name: 'SQ_CANDIDATO', value: '"250000000001"', marker: 3 },
  { name: 'DT_RECEITA', value: '"14/08/2026"' },
  { name: 'NR_CPF_CNPJ_DOADOR', value: '"00000000000100"', marker: 2 },
  { name: 'NM_DOADOR', value: '"EXEMPLO COMERCIO LTDA"' },
  { name: 'VR_RECEITA', value: '"25000,00"', marker: 1 },
];

export const TRACE_RECORDS: readonly TraceRecord[] = [
  {
    marker: 1,
    type: 'Donation',
    value: 'R$\u00a025,000.00, received on August\u00a014, 2026',
    provenance: 'Official value, as published by the TSE',
  },
  {
    marker: 2,
    type: 'Donor',
    value: 'A company, matched by its CNPJ to the federal company register',
    provenance: 'Confirmed by an official identifier',
  },
  {
    marker: 3,
    type: 'Candidate',
    value: 'Linked to the campaign’s profile, money flows, and transactions',
    provenance: 'Official TSE candidate ID',
  },
];
