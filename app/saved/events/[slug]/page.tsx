import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import QuickLinks from "@/components/QuickLinks"
import Background from "@/components/BackgroundStyles"
import { getEventBySlug } from "@/lib/events"
import EventActions from "./EventActions"
import styles from "./eventslug.module.css"

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className={styles.main}>

      <Navbar />
      
      <Background />
      
      <QuickLinks />

      <div className={styles.pageWrap}>
        <section className={styles.card}>
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>{event.category}</span>

            {event.foodProvided && (<span className={styles.featuredBadge}>Food Available</span>)}
          </div>

          <p className={styles.eyebrow}>Campus Companion</p>

          <h1 className={styles.title}>{event.title}</h1>

          <p className={styles.subtitle}>{event.description}</p>

          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <p className={styles.infoHeading}>Category</p>
              
              <p className={styles.infoText}>{event.category}</p>
            </div>

            <div className={styles.infoBox}>
              <p className={styles.infoHeading}>Date</p>

              <p className={styles.infoText}>{new Date(event.date).toLocaleDateString("en-IE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className={styles.infoBox}>
              <p className={styles.infoHeading}>Time</p>
              
              <p className={styles.infoText}>{event.time}</p>
            </div>

            <div className={styles.infoBox}>
              <p className={styles.infoHeading}>Location</p>
              
              <p className={styles.infoText}>{event.location}</p>
            </div>

            <div className={styles.infoBox}>
              <p className={styles.infoHeading}>Hosted by</p>

              <p className={styles.infoText}>{event.society}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Food & Refreshments</h2>

            <p className={styles.sectionText}><strong>Food provided:</strong> {event.foodProvided ? "Yes" : "No"}</p>

            <p className={styles.sectionText}>{event.foodInfo}</p>

            {event.foodProvided && event.menu.length > 0 ? (
              <>
                <h3 className={styles.menuHeading}>Menu</h3>

                <ul className={styles.menuList}>
                  {event.menu.map((item) => (
                    <li key={item}>{item}</li>))}
                </ul>
              </>
            
            ) : (

              <p className={styles.sectionText}>No menu available.</p>)}
          </div>

          <div className={styles.buttonRow}><EventActions eventId={event.id} primaryClass={styles.primaryButton} secondaryClass={styles.secondaryButton}/></div>

          <Link href="/events" className={styles.backLink}>← Back to Events</Link>
        </section>
      </div>
    </main>
  );
}