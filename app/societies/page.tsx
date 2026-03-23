"use client";

import { useMemo, useState } from "react"
import Link from "next/link"
import styles from "./societypage.module.css"
import Navbar from "@/components/Navbar"
import { filterSocieties } from "@/lib/societies"
import { SocietyCategory } from "@/types/society"
import Background from "@/components/BackgroundStyles"
import QuickLinks from "@/components/QuickLinks"

const categories: Array<SocietyCategory | "All"> = [
  "All",
  "Academic",
  "Cultural",
  "Sports",
  "Volunteering",
  "Gaming",
  "Music & Arts",
  "Tech",
];

export default function Society() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SocietyCategory | "All">("All");

  const filteredSocieties = useMemo(() => {
    return filterSocieties({
      query,
      category,
    });
  }, [query, category]);

  return (
    <>
      <main>
        <Navbar />

        <Background />

        <QuickLinks />


        <section className={styles.section}>
          <div className={styles.hero}>

            <p className={styles.eyebrow}>Campus Companion</p>

            <h1 className={styles.title}>Societies</h1>

            <p className={styles.subtitle}>Explore student societies, discover upcoming activities and find a community that matches your interests.</p>
          </div>

          <div className={styles.filterPanel}>
            <div className={styles.fieldGroup}>
              <label htmlFor="society-search" className={styles.label}>Search societies</label>

              <input id="society-search" type="text" placeholder="Search by name, description or tag..." value={query} onChange={(e) => 
                setQuery(e.target.value)} className={styles.input}/>

            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="society-category" className={styles.label}>Category</label>

              <select id="society-category" value={category} onChange={(e) =>
                  setCategory(e.target.value as SocietyCategory | "All")} className={styles.select}>{categories.map((item) => 
                    (<option key={item} value={item}>{item}</option>))}
              </select>
            
            </div>
          </div>

          <p className={styles.resultsCount} aria-live="polite">{filteredSocieties.length} societ
            {filteredSocieties.length === 1 ? "y" : "ies"} found</p>

        </section>

        <section className={`${styles.section} ${styles.section2}`}>{filteredSocieties.length === 0 ? (
            <div className={styles.emptyState}><h2>No Societies Found</h2><p>Try changing your search term or selecting another category.</p></div>

          ) : (

            <div className={styles.grid}>
              {filteredSocieties.map((society) => (
                <article key={society.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    
                    <span className={styles.badge}>{society.category}</span>

                    {society.featured && (<span className={styles.featured}>Featured</span>)}
                  
                  </div>

                  <h2 className={styles.cardTitle}>{society.name}</h2>

                  <p className={styles.cardDescription}>{society.description}</p>

                  <div className={styles.cardInfo}>

                    <p><strong>Meeting day:</strong> {society.meetingDay}</p>

                    <p><strong>Location:</strong> {society.location}</p>

                    <p><strong>Members:</strong> {society.membersCount}</p>

                    <p><strong>Next Event:</strong>{" "} {new Date(society.nextEventDate).toLocaleDateString("en-IE")}</p>

                  </div>

                  <div className={styles.tags}>{society.tags.map((tag) => (<span key={tag} className={styles.tag}>#{tag}</span>))}</div>

                  <Link href={`/societies/${society.slug}`} className={styles.cardButton}>View Details</Link>

                </article>

              ))}

            </div>
          )}
        </section>
      </main>
    </>
  );
}