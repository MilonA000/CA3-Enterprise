"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import QuickLinks from "@/components/QuickLinks"
import Background from "@/components/BackgroundStyles"
import styles from "./Helppage.module.css"
import { supabase } from "@/lib/supabase"

type TicketForm = {
  name: string
  studentId: string
  email: string
  category: string
  priority: string
  issue: string
}

export default function HelpDeskPage() {
  const [formData, setFormData] = useState<TicketForm>({
    name: "",
    studentId: "",
    email: "",
    category: "",
    priority: "",
    issue: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [ticketRef, setTicketRef] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setErrorMessage("")
    setSubmitted(false)

    const generatedRef = `CC-${Math.floor(100000 + Math.random() * 900000)}`

    const { error } = await supabase.from("helpdesk_tickets").insert([
      {
        ticket_ref: generatedRef,
        name: formData.name,
        student_id: formData.studentId,
        email: formData.email,
        category: formData.category,
        priority: formData.priority,
        issue: formData.issue,
      },
    ])

    if (error) {
      setErrorMessage("There was a problem submitting your ticket. Please try again.")
      setLoading(false)
      return
    }

    setTicketRef(generatedRef)
    setSubmitted(true)

    setFormData({
      name: "",
      studentId: "",
      email: "",
      category: "",
      priority: "",
      issue: "",
    })

    setLoading(false)
  }

  return (
    <main className={styles.page}>

      <Navbar />

      <Background />

      <QuickLinks />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Campus Companion</p>

        <h1 className={styles.title}>Help Desk</h1>

        <p className={styles.subtitle}>Submit a support ticket for common campus issues.</p>
      </section>

      <section className={styles.container}>
        <div className={styles.card}>
          {submitted && (
            <div className={styles.successMessage} role="status" aria-live="polite">
              <h2>Ticket submitted successfully</h2>

              <p>Your fictional help desk reference number is <strong>{ticketRef}</strong>.</p>
            </div>
          )}

          {errorMessage && (
            <div className={styles.errorMessage} role="alert">
              <h2>Submission failed</h2>
              
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full name</label>
              
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Enter your full name"/>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="studentId">Student ID</label>
              
              <input id="studentId" name="studentId" type="text" value={formData.studentId} onChange={handleChange} required placeholder="e.g. S1234567"/>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Campus email</label>
              
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="name@campuscompanion.ie"/>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Issue category</label>
              
              <select id="category" name="category" value={formData.category} onChange={handleChange} required>

                <option value="">Select a category</option>
                <option value="IT Support">IT Support</option>
                <option value="Timetable Problem">Timetable Problem</option>
                <option value="Campus Access">Campus Access</option>
                <option value="Lost and Found">Lost and Found</option>
                <option value="Societies and Events">Societies and Events</option>
              
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="priority">Priority</label>
              
              <select id="priority" name="priority" value={formData.priority} onChange={handleChange} required>

                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="issue">Describe the issue</label>
              
              <textarea id="issue" name="issue" value={formData.issue} onChange={handleChange} required rows={6} placeholder="Describe your issue here..."/>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading} aria-label="Submit Ticket">{loading ? "Submitting..." : "Submit Ticket"}</button>

          </form>
        
        </div>
      
      </section>
    
    </main>
  )
}
