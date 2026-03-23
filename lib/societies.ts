import { societies } from "@/data/societies";
import { Society, SocietyCategory } from "@/types/society"

export function getAllSocieties(): Society[] {
    return societies;
}

export function getFeaturedSocieties(): Society[] {
    return societies.filter((society) => society.featured);
}

export function getSocietyBySlug(slug: string): Society | undefined {
    return societies.find((society) => society.slug === slug);
}

export function filterSocieties(params: {
    query?: string;
    category?: SocietyCategory | "All";
}): Society[] {
    const { query = "", category = "All" } = params;

    return societies.filter((society) => {
        const matchesQuery = 
        society.name.toLowerCase().includes(query.toLowerCase()) ||
        society.description.toLowerCase().includes(query.toLowerCase()) ||
        society.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
        );

    const matchesCategory = 
        category == "All" ? true : society.category === category;
    return matchesQuery && matchesCategory; 
  });
}