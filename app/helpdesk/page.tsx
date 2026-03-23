"use client";

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./Helppage.module.css"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

export default function Timetable() {
    const router = useRouter()

    return (
        <>
            <div className={styles.pageBackground} />

            <section className={styles.Decoration4}></section>
            <section className={styles.Decoration5}></section>
            <section className={styles.Decoration6}></section>

            <section className={styles.Decoration1}></section>
            <section className={styles.Decoration2}></section>
            <section className={styles.Decoration3}></section>

            <div className={styles.wrapper}></div>
            <main className={styles.main}>

                <Navbar />

                <section className={styles.section}></section>
                <section className={`${styles.section} ${styles.section2}`}></section>


            </main>
        </>
    )
}