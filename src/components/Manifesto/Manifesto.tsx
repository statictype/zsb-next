import type { ManifestoData } from "@/types/edition";
import { ReadMore } from "@/components/ReadMore/ReadMore";
import { IsdayBadge } from "@/components/IsdayBadge/IsdayBadge";
import styles from "./Manifesto.module.css";

interface ManifestoProps {
  manifesto: ManifestoData;
}

export function Manifesto({ manifesto }: ManifestoProps) {
  const titleParts = manifesto.highlight
    ? manifesto.title.split(manifesto.highlight)
    : null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.title}>
          <p>
            {titleParts ? (
              <>
                {titleParts[0]}
                <span className={styles.titleHighlight}>
                  {manifesto.highlight}
                </span>
                {titleParts[1]}
              </>
            ) : (
              manifesto.title
            )}
          </p>
        </div>
        <div className={styles.content}>
          <ReadMore>
            <div className={styles.text}>
              {manifesto.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </ReadMore>
          <IsdayBadge />
        </div>
      </div>
    </section>
  );
}
