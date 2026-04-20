"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { searchData } from "./searchData"
import styles from "./pagesearch.module.css"
import Navbar from "@/components/Navbar"
import Background from "@/components/BackgroundStyles"

export default function SearchPage() {
  const searchParams = useSearchParams();

  const rawQuery = searchParams.get("q")?.trim() ?? "";
  const query = rawQuery.toLowerCase();

  const results = useMemo(() => {
    if (!query) return [];

    return searchData.filter((item) => {
      const combinedText = [
        item.title,
        item.description,
        item.category,
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return combinedText.includes(query);
    });
  }, [query]);

  return (
    <>
        <main>
          
          <Navbar />

          <Background />

          <div className={styles.searchShell}>
            <div className={styles.searchPanel}>
              <h1 className={styles.heading}>Search Results</h1>

              <p className={styles.subText}> {query ? `Showing results for "${rawQuery}"` : "Enter a search term from the homepage."}</p>


              {query && results.length > 0 ? ( 
                
                <div className={styles.resultsGrid}>{results.map((item) => (
                    
                    <Link key={item.href} href={item.href} className={styles.resultCard}>
                      <p className={styles.category}>{item.category}</p>

                      <h2 className={styles.title}>{item.title}</h2>
                      
                      <p className={styles.description}>{item.description}</p>
                    </Link>

                  ))} </div>

                ) : query ? (
                
                <div className={styles.emptyBox}>No results found for <strong>{rawQuery}</strong>.</div>
                
                ) : (

                <div className={styles.emptyBox}>Try searching for things like <strong>Societies</strong>,{" "}
                  <strong>Map</strong>, <strong>Food</strong>, or{" "}<strong>Support</strong>.</div>
                )}

                <Link href="/" className={styles.shellHomeButton}>Return</Link>
            </div>

          </div>
          
        </main>
    </>
  );
}