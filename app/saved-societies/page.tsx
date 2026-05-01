import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Background from "@/components/BackgroundStyles"
import QuickLinks from "@/components/QuickLinks"
import styles from "./savedsocietiespage.module.css"
import { createClient } from "@/lib/supabase-server"
import type { Society, SocietyCategory } from "@/types/society"

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

export default async function SavedSocietiesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function removeSavedSociety(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const societyId = formData.get("societyId");

    if (!societyId || typeof societyId !== "string") {
      throw new Error("Missing society id.");
    }

    const { error } = await supabase
      .from("saved_societies")
      .delete()
      .eq("user_id", user.id)
      .eq("society_id", societyId);

    if (error) {
      throw new Error(`Failed to remove saved society: ${error.message}`);
    }

    revalidatePath("/saved-societies");
  }

  const { data, error } = await supabase
    .from("saved_societies")
    .select(`
      created_at,
      societies (
        id,
        slug,
        name,
        category,
        description,
        meeting_day,
        location,
        tags,
        members_count,
        featured,
        next_event_date,
        image_url
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const societies = (data ?? [])
    .map((item) => (Array.isArray(item.societies) ? item.societies[0] : item.societies))
    .filter(Boolean)
    .map((row) => mapSociety(row as SocietyRow));

  return (
    <main className={styles.savedPageLayout}>

      <Navbar />

      <Background />

      <QuickLinks />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Campus Companion</p>

        <h1 className={styles.title}>Saved Societies</h1>

        <p className={styles.subtitle}>Your bookmarked societies.</p>

      </section>

      <section className={styles.section}>
        {societies.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No saved societies</h2>

            <p>Go save a society to see it here.</p>
          </div>

        ) : (

          <div className={styles.grid}>
            {societies.map((society) => (
              <article key={society.id} className={styles.card}>
                <div className={styles.cardTop}><span className={styles.badge}>{society.category}</span>
                  
                  {society.featured && (<span className={styles.featured}>Featured</span>)}

                </div>

                <h2 className={styles.cardTitle}>{society.name}</h2>

                <p className={styles.cardDescription}>{society.description}</p>

                <div className={styles.cardInfo}>

                  <p><strong>Meeting day:</strong> {society.meetingDay}</p>

                  <p><strong>Location:</strong> {society.location}</p>

                  <p><strong>Members:</strong> {society.membersCount}</p>

                  <p><strong>Next Event:</strong>{" "}{society.nextEventDate ? new Date(society.nextEventDate).toLocaleDateString("en-IE") : "TBC"}</p>

                </div>

                <div className={styles.tags}>
                  
                  {society.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>#{tag}</span>))}

                </div>

                <div className={styles.buttonRow}>

                  <Link href={`/societies/${society.slug}`} className={styles.cardButton} aria-label="View Details">View Details</Link>

                  <form action={removeSavedSociety}>

                    <input type="hidden" name="societyId" value={society.id} />
                    
                    <button type="submit" className={styles.removeButton} aria-label="Remove from Saved List">Remove</button>

                  </form>
                
                </div>
              
              </article>
            ))}
          
          </div>
        
        )}
      </section>
    </main>
  );
}
