"use client";

import { useMemo, useState } from "react";
import { campusLocations } from "@/data/locations";
import Link from "next/link";
import Image from "next/image";
import styles from "./Mappage.module.css";
import Navbar from "@/components/Navbar"
import Background from "@/components/BackgroundStyles";
import QuickLinks from "@/components/QuickLinks";

const filters = [
  "All",
  "Academic",
  "Food",
  "Study",
  "Support",
  "Recreation",
  "Accessibility",
] as const;

export default function CampusMapPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All");

  const [selectedId, setSelectedId] = useState<string | null>(
    campusLocations[0]?.id ?? null
  );

  const filteredLocations = useMemo(() => {
    return campusLocations.filter((location) => {
      const search = query.toLowerCase();

      const matchesQuery =
        location.name.toLowerCase().includes(search) ||
        location.description.toLowerCase().includes(search) ||
        location.services.some((service) =>
          service.toLowerCase().includes(search)
        ) ||
        location.accessibility.some((item) =>
          item.toLowerCase().includes(search)
        ) ||
        location.category.toLowerCase().includes(search);

      const matchesFilter =
        activeFilter === "All" || location.category === activeFilter;

      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter]);

  const selectedLocation =
    filteredLocations.find((location) => location.id === selectedId) ??
    filteredLocations[0] ??
    null;

  return (
    <>
        <main>
          <div className={styles.contentLayer}>

            <Navbar />

            <Background />

            <QuickLinks />

            <section className={styles.mapPageLayout}>
              <aside className={styles.mapHero}>
                <div className={styles.mapHeroContent}>
                  <div>
                    
                    <p className={styles.eyebrow}>Campus Companion</p>

                    <h1>Campus Map</h1>

                    <p>Find study spaces, food spots, support services, and key buildings across campus.</p>
                  </div>
                </div>
              </aside>

              <div className={styles.mapContentColumn}>
                <section className={styles.mapPanel}>
                  <h2 className={styles.mapHeading}>Campus Overview</h2>

                  <div className={styles.mapTopSearch}>

                    <input id="map-search" type="text" placeholder="Search by building, service, or category" value={query} 
                        onChange={(e) => setQuery(e.target.value)} className={styles.mapSearchInput}/>

                  </div>

                  <div className={styles.mapBody}>
                    <div className={styles.mapFilterSidebar}>
                      {filters.map((filter) => (

                        <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`${styles.filterButton} ${activeFilter === 
                          filter ? styles.activeFilter : ""}`}>{filter}</button>

                      ))}
                    </div>

                    <div className={styles.mapCanvas}>
                      <div className={styles.mapBuildingA} aria-hidden="true" />
                      <div className={styles.mapBuildingB} aria-hidden="true" />
                      <div className={styles.mapBuildingC} aria-hidden="true" />
                      <div className={styles.mapBuildingD} aria-hidden="true" />
                      <div className={styles.mapBuildingE} aria-hidden="true" />
                      <div className={styles.mapBuildingF} aria-hidden="true" />

                      <div className={styles.mapBuildingLabel} style={{ left: "15.4%", top: "38%" }}>River Court Library</div>

                      <div className={styles.mapBuildingLabel} style={{ left: "38.45%", top: "46%" }}>Oak Hall</div>

                      <div className={styles.mapBuildingLabel} style={{ left: "61.47%", top: "29%" }}>North Gate Café</div>

                      <div className={styles.mapBuildingLabel} style={{ left: "26.5%", top: "73%" }}>Support Hub</div>

                      <div className={styles.mapPathHorizontal} aria-hidden="true" />
                      <div className={styles.mapPathVertical} aria-hidden="true" />

                      {filteredLocations.map((location) => (

                        <button key={location.id} type="button" onClick={() => setSelectedId(location.id)} className={`${styles.mapMarker} ${
                            selectedLocation?.id === location.id ? styles.mapMarkerActive : "" }`} style={{ left: `${location.x}%`, top: `${location.y}%`,}}
                              aria-label={`View ${location.name} on map`}>{location.code}</button>

                      ))}
                    </div>
                  </div>
                </section>

                <aside className={styles.locationPanel}>
                  <div className={styles.locationPanelContent}>
                    <h2 className={styles.locationPanelTitle}>Location Details</h2>

                    {selectedLocation ? (
                      <div className={styles.locationCard}>

                        <p className={styles.locationCategory}>{selectedLocation.category}</p>

                        <h3 className={styles.locationName}>{selectedLocation.name}</h3>

                        <p className={styles.locationDescription}>{selectedLocation.description}</p>

                        <p className={styles.locationMeta}><strong>Hours: </strong>{selectedLocation.hours}</p>

                        <p className={styles.locationMeta}><strong>Services:</strong></p>

                        <ul className={styles.locationList}>{selectedLocation.services.map((service) => (<li key={service}>{service}</li>))}</ul>

                        <p className={styles.locationMeta}><strong>Accessibility:</strong></p>

                        <ul className={styles.locationList}>{selectedLocation.accessibility.map((item) => (<li key={item}>{item}</li>))}</ul>

                      </div>

                    ) : (

                      <p className={styles.emptyState}>No location selected.</p>
                    
                    )}

                    <div className={styles.quickLinks}>
                      <button type="button" className={styles.quickLinkButton} onClick={() => setActiveFilter("Food")}>Find Food</button>

                      <button type="button" className={styles.quickLinkButton} onClick={() => setActiveFilter("Study")}>Find Study Spaces</button>

                      <button type="button" className={styles.quickLinkButton} onClick={() => setActiveFilter("Support")}>Find Support</button>

                      <button type="button" className={styles.quickLinkButton} onClick={() => setActiveFilter("Accessibility")}>Accessible Locations</button>
                    </div>
                  </div>
                </aside>

                <section className={styles.directoryStrip}>
                  {filteredLocations.slice(0, 4).map((location) => (
                    
                    <button key={location.id} type="button" onClick={() => setSelectedId(location.id)} className={styles.directoryCard}>
                      <h3>{location.code} · {location.name}</h3><p>{location.category}</p>
                    </button>

                  ))}
                </section>
              </div>
            </section>
          </div>
        </main>
    </>
  );
}