import { notFound } from "next/navigation"
import Link from "next/link"
import { getSocietyBySlug } from "@/lib/societies"
import Background from "@/components/BackgroundStyles"
import Navbar from "@/components/Navbar"
import styles from "./societyslug.module.css"

type SocietyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SocietyDetailPage({
  params,
}: SocietyDetailPageProps) {
  const { slug } = await params;
  const society = getSocietyBySlug(slug);

  if (!society) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <Background />

      <main className={styles.main}>
        <section className={styles.societySearch}>
          
          <article className={styles.card}>
            <div className={styles.badgeRow}>
              <span className={styles.categoryBadge}>{society.category}</span>

              {society.featured && (<span className={styles.featuredBadge}>Featured Society</span>)}
            </div>

            <h1 className={styles.title}>{society.name}</h1>

            <p className={styles.description}>{society.description}</p>

            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <h2 className={styles.infoHeading}>Meeting schedule</h2>
                
                <p className={styles.infoText}>{society.meetingDay}</p>
              </div>

              <div className={styles.infoBox}>
                <h2 className={styles.infoHeading}>Location</h2>
                
                <p className={styles.infoText}>{society.location}</p>
              </div>

              <div className={styles.infoBox}>
                <h2 className={styles.infoHeading}>Members</h2>
                
                <p className={styles.infoText}>{society.membersCount} active members</p>

              </div>

              <div className={styles.infoBox}>
                <h2 className={styles.infoHeading}>Next event</h2>

                <p className={styles.infoText}>{new Date(society.nextEventDate).toLocaleDateString("en-IE")}</p>
              </div>
            </div>

            <div className={styles.tagsSection}>
              <h2 className={styles.infoHeading}>Tags</h2>
              <div className={styles.tagsWrapper}>
                {society.tags.map((tag) => (

                  <span key={tag} className={styles.tag}>#{tag}</span>))}
              
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button className={styles.primaryButton} type="button">Save society</button>

              <button className={styles.secondaryButton} type="button">View upcoming events</button>
            </div>
            
            <Link href="/societies" className={styles.backLink}>← Back to societies</Link>

          </article>          
          
          
          
        </section>
      </main>
    </>
  );
}
