"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./loginpage.module.css"
import Navbar from "@/components/Navbar"
import Background from "@/components/BackgroundStyles"

export default function LoginPage() {
  const router = useRouter()

  const [studentId, setStudentId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setTimeout(() => setError(""), 3000);

    if (!studentId.trim() || !password.trim()) {
      setError("Please enter both your student ID and password.")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId.trim(),
          password,
        }),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        setError(result.message || "Invalid student ID or password.")
        return
      }

      localStorage.setItem("campusUser", JSON.stringify(result.user))

      setSuccess(`Login successful. Welcome, ${result.user.name}. Redirecting...`)

      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1000)
    } catch {
      setError("Unable to log in right now. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
        <main>
          
          <Navbar />

          <Background />

          <section className={styles.loginShell}>
            <div className={styles.loginCard}>
              <div className={styles.loginHeader}>
                <h1>Welcome Back</h1>
                
                <p>Sign in to access your Campus Companion account.</p>
              </div>

              <form className={styles.loginForm} onSubmit={handleLogin}>
                <div className={styles.formGroup}>
                  <label htmlFor="studentId">Student ID</label>

                  <input id="studentId" type="text" placeholder="Enter your student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)}/>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>

                  <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}
                {success && <p className={styles.successMessage}>{success}</p>}

                <button type="submit" className={styles.loginButton} disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>

              </form>

              <div className={styles.loginFooter}>

                <p>Demo login: <strong>A00028743</strong></p>

                <p>Password: <strong>campus123</strong></p>

                <Link href="/" className={styles.backLink}>Back to Home</Link>

              </div>
            </div>
          </section>
        </main>
    </>
  )
}
