"use client"

import Navbar from "@/components/Navbar"
import QuickLinks from "@/components/QuickLinks"
import Background from "@/components/BackgroundStyles"
import styles from "./eventspage.module.css"
import { getAllEvents } from "@/lib/events"
import EventsClient from "./EventsClient"

type EventsPageProps = {
  searchParams: Promise<{ society?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const events = await getAllEvents();
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

      <EventsClient events={events} societySlug={society ?? ""} />
    </main>
  );
}
