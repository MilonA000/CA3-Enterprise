import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import Background from "@/components/BackgroundStyles"
import Navbar from "@/components/Navbar"
import styles from "./societyslug.module.css"
import { createClient } from "@/lib/supabase-server"
import type { Society, SocietyCategory } from "@/types/society"

type SocietyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type SocietyRow = {
  id: string;
  slug: string;
  name: string;
  category: SocietyCategory;
  description: string;
  meeting_day: string | null;
  location: string | null;
  tags: string[] | null;
  members_count: number | null;
  featured: boolean | null;
  next_event_date: string | null;
  image_url: string | null;
};

function mapSociety(row: SocietyRow): Society {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    meetingDay: row.meeting_day ?? "TBC",
    location: row.location ?? "TBC",
    tags: row.tags ?? [],
    membersCount: row.members_count ?? 0,
    featured: row.featured ?? false,
    nextEventDate: row.next_event_date ?? "",
    imageUrl: row.image_url ?? "",
  };
}

export default async function SocietyDetailPage({
  params,
}: SocietyDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("societies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const society = mapSociety(data as SocietyRow);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadySaved = false;

  if (user) {
    const { data: savedRow } = await supabase
      .from("saved_societies")
      .select("id")
      .eq("user_id", user.id)
      .eq("society_id", society.id)
      .maybeSingle();

    alreadySaved = !!savedRow;
  }

  async function saveSocietyAction() {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { error } = await supabase.from("saved_societies").upsert(
      {
        user_id: user.id,
        society_id: society.id,
      },
      {
        onConflict: "user_id,society_id",
      }
    );

    if (error) {
      throw new Error(`Failed to save society: ${error.message}`);
    }

    revalidatePath(`/societies/${society.slug}`);
    revalidatePath("/saved-societies");
  }

  return (
    <>
      <Navbar />
      
      <Background />

      <main className={styles.main}>
        <section className={styles.societySearch}>
          <article className={styles.card}>
            <div className={styles.badgeRow}>
              
              <span className={styles.categoryBadge}>{society.category}</span>

              {society.featured && (<span className={styles.featuredBadge}>Featured Society</span>)}

            </div>

            <h1 className={styles.title}>{society.name}</h1>

            <p className={styles.description}>{society.description}</p>

            <div className={styles.infoGrid}>
              
              <div className={styles.infoBox}>
              
                <h2 className={styles.infoHeading}>Meeting schedule</h2>
              
                <p className={styles.infoText}>{society.meetingDay}</p>
              
              </div>

              <div className={styles.infoBox}>
              
                <h2 className={styles.infoHeading}>Location</h2>
              
                <p className={styles.infoText}>{society.location}</p>
              
              </div>

              <div className={styles.infoBox}>
                
                <h2 className={styles.infoHeading}>Members</h2>
                
                <p className={styles.infoText}>{society.membersCount} active members</p>
              
              </div>

              <div className={styles.infoBox}>
                
                <h2 className={styles.infoHeading}>Next event</h2>

                <p className={styles.infoText}>{society.nextEventDate ? new Date(society.nextEventDate).toLocaleDateString("en-IE") : "TBC"}</p>
        
              </div>
            </div>

            <div className={styles.tagsSection}>
              <h2 className={styles.infoHeading}>Tags</h2>
 
              <div className={styles.tagsWrapper}>
                {society.tags.map((tag) => (

                  <span key={tag} className={styles.tag}>#{tag}</span>))}

              </div>
            </div>

            <div className={styles.buttonRow}>
              <form action={saveSocietyAction}>
                
                <button className={styles.primaryButton} type="submit" disabled={alreadySaved} aria-label="Save Society">{alreadySaved ? "Saved ✓" : "Save society"}</button>

              </form>

              <Link href={`/events?society=${society.slug}`} className={styles.secondaryButton} aria-label="View Upcoming Events">View upcoming events</Link>

            </div>

            <Link href="/societies" className={styles.backLink} aria-label="Back to Societies">← Back to Societies</Link>

          </article>
        </section>
      </main>
    </>
  );
}
