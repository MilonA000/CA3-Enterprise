"use client"

import { useEffect, useMemo, useState } from "react"
import styles from "./timetablepage.module.css"
import Navbar from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import Background from "@/components/BackgroundStyles"
import QuickLinks from "@/components/QuickLinks"

type TimetableEntry = {
  id: string;
  day_of_week: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  start_time: string;
  end_time: string;
  module_code: string;
  module_name: string;
  location: string;
  lecturer_name: string;
  week_type: "All" | "Odd" | "Even";
  delivery_mode: "In Person" | "Online" | "Hybrid";
};

const DAYS: TimetableEntry["day_of_week"][] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function formatTime(time: string) {
  return time.slice(0, 5);
}

export default function Timetable() {
  const [selectedDay, setSelectedDay] =
    useState<TimetableEntry["day_of_week"]>("Monday");
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTimetable() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("timetable_entries")
        .select("*")
        .eq("day_of_week", selectedDay)
        .order("start_time", { ascending: true });

      if (error) {
        setError("Could not load timetable entries.");
        setEntries([]);
      } else {
        setEntries(data || []);
      }

      setLoading(false);
    }

    fetchTimetable();
  }, [selectedDay]);

  const pageTitle = useMemo(() => `${selectedDay} Timetable`, [selectedDay]);

  return (
    <>
      <main className={styles.timetablePageLayout}>
        <Navbar />

        <Background />

        <QuickLinks />

        <section className={styles.timetableHero}>
          <div className={styles.timetableHeroContent}>
            <div className={styles.eyebrow}>Campus Companion</div>

            <h1>Student Timetable</h1>

            <p>View your weekly classes and sessions. All timetable data shown here is fictional.</p>
          </div>
        </section>

        <aside className={styles.timetableSummaryCard}>
          <div className={styles.timetableSummaryContent}>
            <h2>This Week</h2>

            <div className={styles.summaryStat}>
              <span className={styles.summaryLabel}>Selected day</span>
              <span className={styles.summaryValue}>{selectedDay}</span>
            </div>

            <div className={styles.summaryStat}>
              <span className={styles.summaryLabel}>Classes</span>
              <span className={styles.summaryValue}>{entries.length}</span>
            </div>

            <div className={styles.summaryStat}>
              <span className={styles.summaryLabel}>Status</span>

              <span className={styles.summaryValue}>{loading ? "Loading..." : error ? "Error" : "Ready"}</span>
            </div>

          </div>
        </aside>

        <div className={styles.timetableContentColumn}>
          <section className={`${styles.section} ${styles.timetablePanel}`}>

            <h2 className={styles.timetableHeading}>Weekly Schedule</h2>

            <p className={styles.timetableSubheading}>Select a day to view scheduled classes, locations and delivery details.
            </p>

            <div className={styles.dayTabs} role="tablist" aria-label="Select timetable day">
              
              {DAYS.map((day) => (

                <button key={day} type="button" role="tab" aria-selected={selectedDay === day} className={`${styles.dayButton} ${
                    selectedDay === day ? styles.activeDayButton : ""}`} onClick={() => setSelectedDay(day)}>{day}
                </button>
              
              ))}
            </div>

            <h3 className={styles.visuallyHidden}>{pageTitle}</h3>

            {loading && (
              <div className={styles.messageCard}>Loading timetable...</div>)}

            {error && (

              <div className={styles.errorCard} role="alert">{error}</div>)}

            {!loading && !error && entries.length === 0 && (
              <div className={styles.messageCard}>No Classes Scheduled for {selectedDay}.</div>)}

            {!loading && !error && entries.length > 0 && (
              <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>

                    <caption className={styles.visuallyHidden}>Timetable entries for {selectedDay}</caption>
                    
                    <thead>
                      <tr>
                        <th scope="col">Time</th>
                        <th scope="col">Module</th>
                        <th scope="col">Location</th>
                        <th scope="col">Lecturer</th>
                        <th scope="col">Mode</th>
                        <th scope="col">Week</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                      {entries.map((entry) => (
                        
                        <tr key={entry.id}>
                          
                          <td className={styles.timeCell}>
                            {formatTime(entry.start_time)} -{" "}
                            {formatTime(entry.end_time)}
                          </td>
                          
                          <td>

                            <div className={styles.moduleName}>{entry.module_name}</div>
                            
                            <div className={styles.moduleCode}>{entry.module_code}</div>
                          
                          </td>
                          
                          <td>{entry.location}</td>
                          
                          <td>{entry.lecturer_name}</td>
                          
                          <td>

                            <span className={styles.modeBadge}>{entry.delivery_mode}</span>
                          
                          </td>
                          
                          <td>

                            <span className={styles.weekBadge}>{entry.week_type}</span>
                          
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <section className={styles.infoStrip}>
            <div className={styles.infoCard}>
              <h3>Fictional data only</h3>

              <p>All timetable entries, locations, lecturer names and modules are fictional for coursework use.</p>
            </div>

            <div className={styles.infoCard}>
              <h3>Placeholder</h3>

              <p>Placeholder</p>
            </div>

            <div className={styles.infoCard}>
              <h3>Placeholder</h3>

              <p>Placeholder</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}