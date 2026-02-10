import type { CreditEntry } from "@/types/edition";
import styles from "./Credits.module.css";

interface CreditsProps {
  credits: CreditEntry[];
}

export function Credits({ credits }: CreditsProps) {
  const primary = credits.filter((c) => c.type === "primary");
  const partners = credits.filter((c) => c.type === "partner");
  const secondary = credits.filter((c) => c.type === "secondary");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Primary Credits */}
        <div className={styles.primary}>
          {primary.map((credit, i) => (
            <div key={i} className={styles.block}>
              <span className={styles.label}>{credit.label}</span>
              <span className={styles.name}>{credit.value}</span>
              {credit.detail && (
                <span className={styles.detail}>
                  {credit.detail.split("\n").map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < credit.detail!.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </span>
              )}
              {credit.logo && (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={credit.logo}
                    alt={credit.logoAlt || ""}
                    className={styles.logo}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Partners */}
        {partners.length > 0 && (
          <div className={styles.partners}>
            {partners.map((credit, i) => (
              <div key={i} className={styles.partnersBlock}>
                <span className={styles.partnersLabel}>{credit.label}</span>
                <div className={styles.partnersList}>
                  {credit.value.split("\n").map((name, j) => (
                    <span key={j}>{name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Secondary Credits */}
        {secondary.length > 0 && (
          <div className={styles.secondary}>
            {secondary.map((credit, i) => (
              <div key={i} className={styles.inline}>
                <span className={styles.inlineLabel}>{credit.label}</span>
                <span className={styles.inlineNames}>
                  {credit.value.split("\n").map((name, j) => (
                    <span key={j}>
                      {name}
                      {j < credit.value.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
