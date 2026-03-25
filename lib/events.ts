import { supabase } from "@/lib/supabase";

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  society: string;
  description: string;
  featured: boolean;
  foodProvided: boolean;
  foodInfo: string;
  menu: string[];
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  event_date: string;
  time: string;
  location: string;
  description: string;
  featured: boolean;
  food_provided: boolean;
  food_info: string;
  menu: string[] | null;
  societies?: { name: string } | { name: string }[] | null;
};

function mapEvent(row: EventRow): EventItem {
  const societyName = Array.isArray(row.societies)
    ? row.societies[0]?.name ?? "Unknown Society"
    : row.societies?.name ?? "Unknown Society";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.event_date,
    time: row.time,
    location: row.location,
    society: societyName,
    description: row.description,
    featured: row.featured,
    foodProvided: row.food_provided,
    foodInfo: row.food_info,
    menu: row.menu ?? [],
  };
}

export async function getAllEvents(): Promise<EventItem[]> {
  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      slug,
      title,
      category,
      event_date,
      time,
      location,
      description,
      featured,
      food_provided,
      food_info,
      menu,
      societies(name)
    `)
    .order("event_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return ((data ?? []) as EventRow[]).map(mapEvent);
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      slug,
      title,
      category,
      event_date,
      time,
      location,
      description,
      featured,
      food_provided,
      food_info,
      menu,
      societies(name)
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return mapEvent(data as EventRow);
}