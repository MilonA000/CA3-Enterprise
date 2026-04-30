"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("Account")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setIsLoggedIn(false)
        setUserName("Account")
        return
      }

      setIsLoggedIn(true)
      setUserName(
        session.user.user_metadata?.name ||
          session.user.email ||
          "Account"
      )
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsLoggedIn(false)
        setUserName("Account")
        return
      }

      setIsLoggedIn(true)
      setUserName(
        session.user.user_metadata?.name ||
          session.user.email ||
          "Account"
      )
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUserName("Account")
    setMenuOpen(false)
  }

  return (
    <nav className={styles.navbar}>

      <button type="button" className={styles.menuToggle} onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>

      <div className={styles.navbarButton}>

        <Link href="/" className={styles.navHomeBtn} area-label="Return Home">Home</Link>

        <Link href="/helpdesk" className={styles.navEventsBtn} aria-label="Help Desk">Help</Link>

        {isLoggedIn ? (
          
          <>

            <Link href="/settings" className={styles.navSignInBtn} aria-label="Account">{userName}<Image src="/user-icon.png"
                alt="User icon"
                width={24}
                height={24}/>
            </Link>

          </>

        ) : (

          <Link href="/login" className={styles.navSignInBtn} aria-label="Sign In">Sign In<Image
              src="/logo.png"
              alt="Sign in logo"
              width={24}
              height={24}/>
          </Link>
        )}

        
      </div>

      <div className={`${styles.sideMenu} ${menuOpen ? styles.open : ""}`}>

        <button className={styles.closeBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu" type="button">✖</button>

        <Link href="/" className={`${styles.sideMenuLink} ${styles.homeButton}`} onClick={() => setMenuOpen(false)} aria-label="Return Home">Home</Link>

        <Link href="/timetable" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)} aria-label="Timetables">Timetables</Link>

        <Link href="/helpdesk" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)} aria-label="Help Desk">Help</Link>

        {isLoggedIn ? (
          
          <>

          <Link href="/settings" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)} aria-label="Settings">

              {userName}<Image className={styles.signInImage2} src="/user-icon.png" alt="User icon" width={24} height={24}/> 
          </Link>

          <Link href="/saved" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)} aria-label="Saved Events">Saved Events</Link>

          <Link href="/saved-societies" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)} aria-label="Saved Societies">Saved Societies</Link>

          </>
        
        ) : (

          <Link href="/login" className={styles.sideMenuLink} onClick={() => setMenuOpen(false)} aria-label="Sign In">Sign In<Image className={styles.signInImage2}
              src="/logo.png"
              alt="Sign in logo"
              width={24}
              height={24}/>
          </Link>

        )}

        <Link href="/settings" className={styles.sideMenuLinkSettings} onClick={() => setMenuOpen(false)} aria-label="Settings">Settings<Image className={styles.settingsImage}
            src="/settings-logo.png"
            alt="Settings logo"
            width={30}
            height={30}/>
        </Link>
      </div>

      {menuOpen && (<div className={styles.pageOverlay} onClick={() => setMenuOpen(false)} aria-hidden="true"/>
      
      )}
    
    </nav>
  )
}
