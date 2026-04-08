import Navbar from "@/components/Navbar"
import QuickLinks from "@/components/QuickLinks"
import Background from "@/components/BackgroundStyles"
import styles from "./eventspage.module.css"
import { getAllEvents } from "@/lib/events"
import { buildAttendancePredictions } from "@/lib/attendance-ml"
import EventsClient from "./EventsClient"

type EventsPageProps = {
  searchParams: Promise<{ society?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const events = await getAllEvents();
  const { predictions, summary } = buildAttendancePredictions(events);
  const predictionByEventId = new Map(predictions.map((entry) => [entry.eventId, entry]));
  const eventsWithPredictions = events.map((event) => ({
    ...event,
    predictedAttendance: predictionByEventId.get(event.id)?.predictedAttendance ?? null,
    predictedBand: predictionByEventId.get(event.id)?.predictedBand ?? null,
  }));
  const { society } = await searchParams;

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

      <EventsClient
        events={eventsWithPredictions}
        societySlug={society ?? ""}
        modelSummary={summary}
      />
    </main>
  );
}