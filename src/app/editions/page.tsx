import type { Metadata } from "next";
import { EditionCard } from "@/components/EditionCard/EditionCard";
import { editionCards } from "@/data/editions/cards";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Editions — Bucharest Sculpture Days",
  description: "Browse all editions of Bucharest Sculpture Days, from 2021 to 2025.",
};

export default function EditionsPage() {
  return (
    <main>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Edit<span className={styles.titleHighlight}>ions</span>
        </h1>
        <div className={styles.meta}>
          <div className={styles.metaLabel}>Archive</div>
          <div className={styles.metaValue}>2021—2025</div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.grid}>
          {editionCards.map((edition) => (
            <EditionCard key={edition.year} edition={edition} />
          ))}
        </div>
      </section>
    </main>
  );
}
