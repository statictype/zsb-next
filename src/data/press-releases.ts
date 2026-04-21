/**
 * Placeholder press releases. PDFs do not yet exist on disk —
 * drop the real files into /public/press/ and update `pdfUrl` accordingly.
 */
export interface PressRelease {
  id: string
  title: string
  edition: string
  language: 'EN' | 'RO'
  pages: number
  size: string
  pdfUrl: string
}

export const PRESS_RELEASES: PressRelease[] = [
  {
    id: '01',
    title: 'ZSB 2025 — #celălaltcorp Press Release',
    edition: '2025',
    language: 'EN',
    pages: 8,
    size: '1.4 MB',
    pdfUrl: '/press/zsb-2025-press-release-en.pdf',
  },
  {
    id: '02',
    title: 'ZSB 2025 — Comunicat de presă',
    edition: '2025',
    language: 'RO',
    pages: 8,
    size: '1.4 MB',
    pdfUrl: '/press/zsb-2025-comunicat.pdf',
  },
  {
    id: '03',
    title: 'ZSB 2024 — #syzygy Press Release',
    edition: '2024',
    language: 'EN',
    pages: 6,
    size: '1.1 MB',
    pdfUrl: '/press/zsb-2024-press-release-en.pdf',
  },
  {
    id: '04',
    title: 'ZSB 2023 — re#situări afective Press Release',
    edition: '2023',
    language: 'EN',
    pages: 7,
    size: '1.2 MB',
    pdfUrl: '/press/zsb-2023-press-release-en.pdf',
  },
  {
    id: '05',
    title: 'ZSB 2022 — #perspectiva31 Press Release',
    edition: '2022',
    language: 'EN',
    pages: 5,
    size: '0.9 MB',
    pdfUrl: '/press/zsb-2022-press-release-en.pdf',
  },
]
