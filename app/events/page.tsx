"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./eventspage.module.css";
import Navbar from "@/components/Navbar";
import QuickLinks from "@/components/QuickLinks";
import Background from "@/components/BackgroundStyles";
import { eventsData } from "@/data/events";

const categories = [
  "All",
  "Tech",
  "Music",
  "Careers",
  "Sports",
  "Social",
  "Wellbeing",
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;

      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.society.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <main>

        <Navbar />
        
        <Background />
        
        <QuickLinks />

        <section className={styles.hero}>
          <p className={styles.eyebrow}>Campus Companion</p>

          <h1 className={styles.title}>Upcoming Events</h1>
          
          <p className={styles.subtitle}>Discover campus events, society meetups, workshops and student activities happening this month.</p>
        </section>

        <section className={styles.filterPanel} aria-label="Event filters">
          <div className={styles.fieldGroup}>
            <label htmlFor="event-search" className={styles.label}>Search events</label>
            
            <input id="event-search" type="text" placeholder="Search by title, location, or society" value={searchTerm} onChange={(e) => 
                setSearchTerm(e.target.value)} className={styles.input}/>
          
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="event-category" className={styles.label}>Category</label>

            <select id="event-category" value={selectedCategory} onChange={(e) => 
                setSelectedCategory(e.target.value)} className={styles.select}>{categories.map((category) => 
                    (<option key={category} value={category}>{category}</option>))}
            </select>

          </div>
        </section>

        <div className={styles.resultsCount} aria-live="polite">
          Showing {filteredEvents.length}{" "} {filteredEvents.length === 1 ? "event" : "events"}
        </div>

        {filteredEvents.length > 0 ? (
          <section className={styles.grid}>
            {filteredEvents.map((event) => (

              <article key={event.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.badge}>{event.category}</span>
                  
                  {event.featured && (<span className={styles.featured}>Featured</span>)}

                </div>

                <h2 className={styles.cardTitle}>{event.title}</h2>

                <p className={styles.cardDescription}>{event.description}</p>

                <div className={styles.cardInfo}>
                  <p><strong>Date:</strong>{" "} {new Date(event.date).toLocaleDateString("en-IE", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <p><strong>Time:</strong> {event.time}</p>
                  
                  <p><strong>Location:</strong> {event.location}</p>

                  <p><strong>Hosted by:</strong> {event.society}</p>

                </div>

                <div className={styles.tags}>
                
                  <span className={styles.tag}>{event.category}</span>
                  
                  <span className={styles.tag}>{event.society}</span>
                
                </div>

                <Link href={`/events/${event.slug}`} className={styles.cardButton}>View Details</Link>
              
              </article>
            ))}

          </section>

        ) : (
            
          <div className={styles.emptyState}>
            <h2>No events found</h2>

            <p>Try changing your search term or choosing another category.</p>
          </div>
        )}
      </main>
    </>
  );
}
