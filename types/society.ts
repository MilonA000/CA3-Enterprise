export type SocietyCategory =
  | "Academic"
  | "Cultural"
  | "Sports"
  | "Volunteering"
  | "Gaming"
  | "Music & Arts"
  | "Tech";

export type Society = {
  id: string;
  slug: string;
  name: string;
  category: SocietyCategory;
  description: string;
  meetingDay: string;
  location: string;
  tags: string[];
  membersCount: number;
  featured: boolean;
  nextEventDate: string;
  imageUrl: string;
};