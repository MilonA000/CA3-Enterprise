"use client"

import Link from "next/link"
import Image from "next/image"
import styles from "./QuickLinks.module.css"
            
export default function QuickLinks() {
  return (
            
            
            <div className={styles.QuickLinks}>
              <div className={styles.QuickLinksContent}>
                <h3>Quick Links</h3>

                <Link href="/timetable" className={styles.QuickLinksLink1} aria-label="Timetables">Timetables<Image className={styles.TimetableImage1}
                    src="/timetable-logo.png"
                    alt="Timetable logo"
                    width={24}
                    height={24}/>
                </Link>

                <Link href="/societies" className={styles.QuickLinksLink2} aria-label="Societies">Societies<Image className={styles.SocialImage1}
                    src="/social-logo.png"
                    alt="Society logo"
                    width={20}
                    height={20}/>
                </Link>

                <Link href="/events" className={styles.QuickLinksLink3} aria-label="Events">Events<Image className={styles.EventImage1}
                    src="/partypopper-logo.png"
                    alt="Part Popper"
                    width={20}
                    height={20}/>
                </Link>

                <Link href="/campus-map" className={styles.QuickLinksLink4} aria-label="Campus Map">Campus Map<Image className={styles.MapImage1}
                    src="/map-logo.png"
                    alt="Map Logo"
                    width={20}
                    height={20}/>
                </Link>

                <Link href="/helpdesk" className={styles.QuickLinksLink6} aria-label="Help Desk">Help Desk<Image className={styles.HelpImage1}
                    src="/help-logo.png"
                    alt="Tools logo"
                    width={20}
                    height={20}/>
                </Link>
              </div>
            </div>
  )
}
