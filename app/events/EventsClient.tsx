"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./eventspage.module.css";
import type { EventItem } from "@/lib/events";

const categories = [
  "All",
  "Tech",
  "Music",
  "Careers",
  "Sports",
  "Social",
  "Wellbeing",
];

type Props = {
  events: EventItem[];
};

export default function EventsClient({ events }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;

      const term = searchTerm.toLowerCase();

      const matchesSearch =
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.society.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [events, searchTerm, selectedCategory]);

  return (
    <>
      <section className={styles.filterPanel} aria-label="Event filters">
        <div className={styles.fieldGroup}>
          <label htmlFor="event-search" className={styles.label}>
            Search events
          </label>

          <input
            id="event-search"
            type="text"
            placeholder="Search by title, location, or society"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="event-category" className={styles.label}>
            Category
          </label>

          <select
            id="event-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.select}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className={styles.resultsCount} aria-live="polite">
        Showing {filteredEvents.length}{" "}
        {filteredEvents.length === 1 ? "event" : "events"}
      </div>

      {filteredEvents.length > 0 ? (
        <section className={styles.grid}>
          {filteredEvents.map((event) => (
            <article key={event.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.badge}>{event.category}</span>

                {event.featured && (
                  <span className={styles.featured}>Featured</span>
                )}
              </div>

              <h2 className={styles.cardTitle}>{event.title}</h2>

              <p className={styles.cardDescription}>{event.description}</p>

              <div className={styles.cardInfo}>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString("en-IE", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <p>
                  <strong>Time:</strong> {event.time}
                </p>

                <p>
                  <strong>Location:</strong> {event.location}
                </p>

                <p>
                  <strong>Hosted by:</strong> {event.society}
                </p>
              </div>

              <div className={styles.tags}>
                <span className={styles.tag}>{event.category}</span>
                <span className={styles.tag}>{event.society}</span>
              </div>

              <Link
                href={`/events/${event.slug}`}
                className={styles.cardButton}
              >
                View Details
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <div className={styles.emptyState}>
          <h2>No events found</h2>
          
          <p>Try changing your search term or choosing another category.</p>
        </div>
      )}
    </>
  );
}