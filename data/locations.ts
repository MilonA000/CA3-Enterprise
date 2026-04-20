export type CampusLocation = {
    id: string;
    name: string;
    code: string;
    category: "Academic" | "Food" | "Study" | "Support" | "Recreation" | "Accessibility";
    description: string;
    hours: string;
    accessibility: string[];
    services: string[];
    x: number;
    y: number;
};

export const campusLocations: CampusLocation[] = [
    {
        id: "library-1",
        name: "River Court Library",
        code: "A",
        category: "Study",
        description: "Main library with silent study area, group rooms and printer access.",
        hours: "08:00 - 21:00",
        accessibility: ["Step-free entrance", "Lift access", "Accessible toilets"],
        services: ["Silent study", "Group study", "Printing"],
        x: 7.6,
        y: 18,
    },
    {
        id: "lecture-1",
        name: "Oak Hall Lecture Centre",
        code: "B",
        category: "Academic",
        description: "Large lecture building for first-year classes and seminars.",
        hours: "08:30 - 18:00",
        accessibility: ["Ramp access", "Hearing loop"],
        services: ["Lecture halls", "Hearing loop"],
        x: 29.8,
        y: 26.69,
    },
    {
        id: "cafe-1",
        name: "North Gate Café",
        code: "C",
        category: "Food",
        description: "Coffee, sandwiches, and hot lunches near the main entrance.",
        hours: "07:30 - 17:00",
        accessibility: ["Step-free entrance"],
        services: ["Coffee", "Lunch", "Takeaway"],
        x: 54.67,
        y: 14,
    },
    {
        id: "support-1",
        name: "Support Hub",
        code: "D",
        category: "Support",
        description: "Advice for wellbeing, finance, academic support, and orientation.",
        hours: "09:00 - 17:00",
        accessibility: ["Step-free entrance", "Accessible desk"],
        services: ["Wellbeing", "Academic support", "Finance help"],
        x: 19.69,
        y: 66.21,
  },
];
