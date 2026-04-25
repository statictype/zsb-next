import type { Metadata } from 'next'
import Image from 'next/image'
import shared from '@/components/Shared.module.css'
import { blobUrl } from '@/lib/blob'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Bucharest Sculpture Days — an annual platform for Romanian contemporary sculpture, born online in 2021.',
  alternates: { canonical: '/about' },
}

const PILLARS = [
  {
    num: '01',
    label: 'Why now?',
    body: 'The profession is ageing. Young sculptors have no studios, no visibility, no entry point. If we do not build the structures to support them now, we lose a generation. ZSB is part of that building.',
  },
  {
    num: '02',
    label: 'Why Bucharest?',
    body: 'ZSB found its home at Combinatul Fondului Plastic, a rare complex of working studios and foundries in the heart of Bucharest. A space that proves there is still room for sculpture to be made, shown, and argued over at full scale.',
  },
] as const

export default function AboutPage() {
  return (
    <main>
      {/* ---- 1. Hero ---- */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={shared.pageTitle}>
            About <span className={shared.accent}>ZSB</span>
          </h1>
          <p className={shared.lead}>
            An annual platform for Romanian contemporary sculpture. Born online in 2021, built each
            year through exhibitions, film, critical debate, and education.
          </p>
        </div>
      </section>

      {/* ---- 2. The Project ---- */}
      <section className={`${shared.section} ${shared.sectionDark} ${styles.projectSection}`}>
        <div className={shared.sectionInner}>
          <div className={styles.projectGrid}>
            <aside className={styles.projectAside}>
              <h2 className={`${shared.sectionTitle} ${styles.projectTitle}`}>
                Not a
                <br />
                festival
              </h2>
            </aside>

            <div className={styles.projectMain}>
              <p>
                We are not running a festival. We are, year by year, building the infrastructure
                through which Romanian sculpture can survive, be seen, and matter.
              </p>
              <p>
                ZSB exists to position contemporary sculpture as a critical practice of the present,
                to support the visibility and professional recognition of Romanian sculptors, and to
                build a living archive of Romanian contemporary sculpture in Bucharest.
              </p>
              <p>
                Each edition creates a public context where sculpture meets film, debate, and
                education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 3. Pillars — Why now / Why Bucharest + place image ---- */}
      <section className={`${shared.section} ${shared.sectionDark} ${styles.pillarsSection}`}>
        <div className={shared.sectionInner}>
          <div className={styles.pillarsGrid}>
            {PILLARS.map((p) => (
              <article key={p.num} className={styles.pillar}>
                <div className={styles.pillarHead}>
                  <span className={styles.pillarNum}>{p.num}</span>
                  <h2 className={styles.pillarTitle}>{p.label}</h2>
                </div>
                <p className={styles.pillarBody}>{p.body}</p>
              </article>
            ))}
          </div>

          <figure className={styles.placeImage}>
            <Image
              src={blobUrl('2025/_dsc5665.jpg')}
              alt="Combinatul Fondului Plastic, Bucharest — sculpture at full scale"
              fill
              sizes="100vw"
              className={styles.placeImageImg}
            />
          </figure>
        </div>
      </section>

      {/* ---- 4. Curator letter — editorial spread on light ---- */}
      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <header className={styles.statementHead}>
            <div className={shared.eyebrowMuted}>A word from the curator</div>

            <div className={styles.statementMasthead}>
              <h2
                className={`${shared.sectionTitle} ${shared.sectionTitleLight} ${styles.statementHeadline}`}
              >
                Why we keep going
              </h2>

              <figure className={styles.statementByline}>
                <div className={styles.authorPhoto}>
                  <Image
                    src="/img/s200_csapo_reka.dup.jpg"
                    alt="Reka Csapo Dup"
                    fill
                    sizes="(max-width: 767px) 160px, 180px"
                    className={styles.authorPhotoImg}
                  />
                </div>
                <figcaption className={styles.authorCaption}>
                  <span className={styles.authorName}>Reka Csapo Dup</span>
                  <span className={styles.authorRole}>Curator, ZSB</span>
                </figcaption>
              </figure>
            </div>
          </header>

          <div className={styles.statementBody}>
            <p>
              Bucharest Sculpture Days began to take shape gradually from 2016, when, together with
              several fellow sculptors from Combinatul Fondului Plastic, we founded the Combinart
              1+1=10 association to realise cultural projects that would highlight the power and
              versatility of the sculpture profession.
            </p>
            <p>
              Our first major event was organised in 2016, in which we screened films about and with
              sculpture and organised the first edition of the &ldquo;Sculptors for the
              Future&rdquo; competition. The members of the association, which dissolved in 2018,
              continue to be active largely in the leadership of the Bucharest Sculpture Branch of
              the Union of Visual Artists.
            </p>
            <p>
              In 2026, at the sixth edition, it is even more important to continue with large-scale
              events to highlight Romanian sculpture. Over time, the profession has begun to age,
              and young sculptors find it harder to reach their peak due to a lack of studio space
              and financial constraints.
            </p>
            <p>
              Our goal is to lay the foundations for a Romanian Sculpture Centre where we can offer
              both working studios and transposition workshops, material resources through
              project-writing teams, and a platform for the profession to consolidate and grow.
            </p>
            <p>
              In the Brâncuși Year, 150 years after the birth of Constantin Brâncuși, let us draw
              inspiration from the support the great sculptor received from Romanian society at the
              beginning of his journey, and let us begin to build the future of Romanian sculpture.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
