"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./Navbar.module.css"

type CampusUser = {
  studentId: string
  name: string
  course: string
  loggedIn: boolean
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("Account")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("campusUser")

      if (!storedUser) {
        setIsLoggedIn(false)
        setUserName("Account")
        return
      }

      try {
        const parsedUser: CampusUser = JSON.parse(storedUser)

        if (parsedUser.loggedIn) {
          setIsLoggedIn(true)
          setUserName(parsedUser.name || "Account")
        } else {
          setIsLoggedIn(false)
          setUserName("Account")
        }
      } catch {
        setIsLoggedIn(false)
        setUserName("Account")
      }
    }

    loadUser()
    window.addEventListener("storage", loadUser)

    return () => {
      window.removeEventListener("storage", loadUser)
    }
  }, [])

  return (
    <nav className={styles.navbar}>
      
      <button type="button" className={styles.menuToggle} onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>

      <div className={styles.navbarButton}>

        <Link href="/" className={styles.navHomeBtn}>Home</Link>

        <Link href="/contact" className={styles.navEventsBtn}>Contact Us</Link>

        {isLoggedIn ? (

          <Link href="/settings" className={styles.navSignInBtn}>{userName}<Image
              src="/user-icon.png"
              alt="User icon"
              width={24}
              height={24}/>
          </Link>

        ) : (

          <Link href="/login" className={styles.navSignInBtn}>Sign In<Image
              src="/logo.png"
              alt="Sign in logo"
              width={24}
              height={24}/>
          </Link>
        )}
      </div>

      <div className={`${styles.sideMenu} ${menuOpen ? styles.open : ""}`}>

        <button className={styles.closeBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu" type="button">✖</button>

        <Link href="/" className={`${styles.sideMenuLink} ${styles.homeButton}`} onClick={() => setMenuOpen(false)}>Home</Link>

        <Link href="/timetable" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)}>Timetables</Link>

        <Link href="/contact" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)}>Contact Us</Link>

        {isLoggedIn ? (

          <Link href="/settings" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)}>{userName}<Image className={styles.signInImage2}
              src="/user-icon.png"
              alt="User icon"
              width={24}
              height={24}/>
          </Link>

        ) : (

          <Link href="/login" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)}>Sign In<Image className={styles.signInImage2}
              src="/logo.png"
              alt="Sign in logo"
              width={24}
              height={24}/>
          </Link>
        )}

        <Link href="/settings" className={styles.sideMenuLinkSettings} onClick={() => setMenuOpen(false)}>Settings<Image className={styles.settingsImage}
            src="/settings-logo.png"
            alt="Settings logo"
            width={30}
            height={30}/>
        </Link>
      </div>

      {menuOpen && (<div className={styles.pageOverlay} onClick={() => setMenuOpen(false)} aria-hidden="true"/>)}
    </nav>
  )
}