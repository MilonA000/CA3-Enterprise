import Navbar from "@/components/Navbar"
import QuickLinks from "@/components/QuickLinks"
import Background from "@/components/BackgroundStyles"
import styles from "./eventspage.module.css"
import { getAllEvents } from "@/lib/events"
import EventsClient from "./EventsClient"

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <main>

      <Navbar />

      <Background />

      <QuickLinks />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Campus Companion</p>

        <h1 className={styles.title}>Upcoming Events</h1>

        <p className={styles.subtitle}>Discover campus events, society meetups, workshops and student activities happening this month.</p>
      </section>

      <EventsClient events={events} />
    </main>
  );
}
