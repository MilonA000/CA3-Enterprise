"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import QuickLinks from "@/components/QuickLinks"
import Background from "@/components/BackgroundStyles"
import { supabase } from "@/lib/supabase"
import { getAllEvents } from "@/lib/events"
import styles from "./savedpage.module.css"

type SavedEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category?: string;
};

export default function SavedEventsPage() {
  const [eventsList, setEventsList] = useState<SavedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSavedEvents = async () => {
      setLoading(true);
      setMessage("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage("Please sign in to view your saved events.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("saved_events")
        .select("event_id")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Load saved events error:", error);
        setMessage("Failed to load saved events.");
        setLoading(false);
        return;
      }

      const savedIds = data?.map((row) => row.event_id) ?? [];

      try {
        const allEvents = await getAllEvents();
        const matchedEvents = allEvents.filter((event) =>
          savedIds.includes(event.id)
        );

        setEventsList(matchedEvents);
      } catch (err) {
        console.error("Load events error:", err);
        setMessage("Failed to load saved events.");
      }

      setLoading(false);
    };

    loadSavedEvents();
  }, []);

  const handleRemove = async (eventId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Please sign in first.");
      return;
    }

    const { error } = await supabase
      .from("saved_events")
      .delete()
      .eq("user_id", session.user.id)
      .eq("event_id", eventId);

    if (error) {
      console.error("Remove saved event error:", error);
      alert("Failed to remove saved event.");
      return;
    }

    setEventsList((prev) => prev.filter((event) => event.id !== eventId));
  };

  return (
    <main className={styles.main}>
      
      <Navbar />
      
      <Background />
      
      <QuickLinks />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Campus Companion</p>

        <h1 className={styles.title}>Saved Events</h1>

        <p className={styles.subtitle}>Keep track of the events you want to come back to later.</p>
      </section>

      {!loading && !message && eventsList.length > 0 && (
      
        <p className={styles.resultsCount}>{eventsList.length} saved event{eventsList.length === 1 ? "" : "s"}</p>
      )}

      {loading && (
        <section className={styles.emptyState}>
          <h2>Loading saved events...</h2>
          
          <p>Please wait while we fetch your saved events.</p>
        </section>
      )}

      {!loading && message && (
        <section className={styles.emptyState}>
          <h2>Saved events unavailable</h2>
          
          <p>{message}</p>
        </section>
      )}

      {!loading && !message && eventsList.length === 0 && (
        <section className={styles.emptyState}>
          <h2>No saved events yet</h2>
          
          <p>Save an event from the events page and it will appear here.</p>
        </section>
      )}

      {!loading && eventsList.length > 0 && (
        <section className={styles.grid}>
          {eventsList.map((event) => (
            <article key={event.id} className={styles.card}>

              <div className={styles.cardTop}>
                <span className={styles.badge}>
                  {event.category || "Event"}
                </span>
              </div>

              <h2 className={styles.cardTitle}>{event.title}</h2>

              <p className={styles.cardDescription}>{event.description}</p>

              <div className={styles.cardInfo}>
                
                <p><strong>Date:</strong>{" "}{new Date(event.date).toLocaleDateString("en-IE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p><strong>Time:</strong> {event.time}</p>

                <p><strong>Location:</strong> {event.location}</p>
              </div>

              <div className={styles.actions}>
                <Link href={`/events/${event.slug}`} className={styles.cardButton}>View Event</Link>

                <button type="button" onClick={() => handleRemove(event.id)} className={styles.secondaryButton}>Remove</button>
              
              </div>
            </article>

          ))}
        
        </section>
     
        )}
    </main>
  );
}