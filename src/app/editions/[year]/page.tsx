import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEdition, getAllEditionYears } from "@/data/editions";
import { Hero } from "@/components/Hero/Hero";
import { Manifesto } from "@/components/Manifesto/Manifesto";
import { ThemeArtists } from "@/components/ThemeArtists/ThemeArtists";
import { Venues } from "@/components/Venues/Venues";
import { Program } from "@/components/Program/Program";
import { Carousel } from "@/components/Carousel/Carousel";
import { Credits } from "@/components/Credits/Credits";
import { MediaKit } from "@/components/MediaKit/MediaKit";
import styles from "./page.module.css";

interface EditionPageProps {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  return getAllEditionYears().map((year) => ({
    year: String(year),
  }));
}

export async function generateMetadata({
  params,
}: EditionPageProps): Promise<Metadata> {
  const { year } = await params;
  const edition = getEdition(Number(year));
  if (!edition) return {};

  return {
    title: edition.title,
    description: `${edition.theme} — Bucharest Sculpture Days ${edition.year}`,
  };
}

export default async function EditionPage({ params }: EditionPageProps) {
  const { year } = await params;
  const edition = getEdition(Number(year));

  if (!edition) {
    notFound();
  }

  // Hero variant: 2022 (tiled bg), 2023 (bg image), 2025 (with-sculpture)
  const heroVariant: Record<number, string> = {
    2022: "2022",
    2023: "2023",
    2025: "with-sculpture",
  };

  return (
    <main className={styles.page}>
      <Hero
        year={edition.year}
        theme={edition.theme}
        themeHighlight={edition.themeHighlight}
        heroImage={edition.heroImage}
        dateTape={edition.dateTape}
        variant={heroVariant[edition.year]}
      />

      <Manifesto manifesto={edition.manifesto} />

      <ThemeArtists
        year={edition.year}
        theme={edition.theme}
        themeSection={edition.themeSection}
        artists={edition.artists}
      />

      <Venues venues={edition.venues} />

      <Program year={edition.year} program={edition.program} />

      <Carousel slides={edition.carousel} theme={edition.theme} />

      <Credits credits={edition.credits} />

      {edition.mediaKit && edition.mediaKit.length > 0 && (
        <MediaKit items={edition.mediaKit} />
      )}
    </main>
  );
}
