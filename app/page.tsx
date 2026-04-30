"use client"

import { useState } from "react"
import styles from "./Homepage.module.css"
import { useRouter } from "next/navigation"
import Navbar from "../components/Navbar"
import QuickLinks from "../components/QuickLinks"
import Background from "../components/BackgroundStyles"
import { Plus_Jakarta_Sans } from "next/font/google"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})



export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }

  return (
    <>
        <main>

          <Navbar />

          <Background />

          <QuickLinks />

          <div className={styles.PopoutShell}>            
            
            <div className={styles.Popout1}>
              <div className={styles.Popout1Content}>
                <h2>Campus Life Companion</h2>

                <p>Find campus services, events, societies and support in one place.</p>
              </div>
            </div>
            
            <div className={styles.Popout2}>
              <h2 className={styles.SearchHeader}>Search Campus Services</h2>

              <div className={styles.searchContainer2}>
                <input id="search2" type="text" placeholder="Find something on campus..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch()}} aria-label="Enter Search Input"/>

                <button type="button" onClick={handleSearch} area-label="Search Application">Search</button>
              </div>

              <p className={styles.SearchContainerP}>Search Events, Societies, Campus Locations and Services.</p>
            </div>

          </div>

        </main>
    </>
  )
}
