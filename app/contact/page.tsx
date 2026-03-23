"use client"

import { useState } from "react"
import styles from "./contactpage.module.css"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Background from "@/components/BackgroundStyles"

export  default function ContactPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState("")
    const[email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fullName,
                email,
                message,
            }),
        })

        if (res.ok) {
            alert("Message sent successfully.")
            setFullName("")
            setEmail("")
            setMessage("")
        } else {
            alert("Something went wrong.")
        }
}


    return (
        <>
                <main>

                    <Navbar />

                    <Background />

                    <div className={styles.PopoutShell}>
                        <h2 className={styles.ContactHeader}>Contact Us</h2>
                        
                        <form onSubmit={handleSubmit} className={styles.Popout1}>    
                            <div className={styles.Popout1Content}>

                                <div className={styles.InputShell}>

                                    <label htmlFor="NameInput" className={styles.NameLabel}>Enter Full Name:</label>
                                    <input id="NameInput" type="text" placeholder="Example: John Doe" value={fullName} 
                                        onChange={(e) => setFullName(e.target.value)}></input>

                                    <label htmlFor="EmailInput" className={styles.EmailLabel}>Enter Email:</label>
                                    <input id="EmailInput" type="text" placeholder="Example: example@mytudublin.ie" value={email}
                                        onChange={(e) => setEmail(e.target.value)}></input>

                                    <label htmlFor="MessageInput" className={styles.MessageLabel}>Message:</label>
                                    <textarea id="MessageInput" className={styles.MessageInput} placeholder="Enter your Message" value={message}
                                        onChange={(e) => setMessage(e.target.value)}/>

                                    <button type="submit" className={styles.ContactButton}>Contact Us</button>

                                </div>

                            </div>
                        </form>
                    </div>
                </main>
        </>
    )
}
