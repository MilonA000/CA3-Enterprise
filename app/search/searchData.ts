export type SearchItem = {
    title: string;
    description: string;
    href: string;
    keywords: string[];
    category: string;
};

export const searchData: SearchItem[] = [
    {
        title: "Timetables",
        description: "View class schedules, timetables and study planning tools.",
        href: "/timetable",
        category: "Academic",
        keywords: ["timetable", "schedule", "classes", "class times", "lecture"],
    },
    {
        title: "Societies", 
        description: "Explore clubs, societies and student communities on campus.",
        href: "/societies",
        category: "Student Life",
        keywords: ["societies", "clubs", "community", "activities", "students"],
    },
    {
        title: "Events",
        description: "Find campus events, activities and upcoming student sessions.",
        href: "/events",
        category: "Student Life", 
        keywords: ["events", "activities", "what's on", "calendar", "social"],
    },
    {
        title: "Campus Map",
        description: "Locate buildings, study spaces, food spots and support hubs.",
        href: "/campus-map",
        category: "Navigation",
        keywords: ["map", "buildings", "location", "study spaces", "library"],
    },
    {
        title: "Canteen",
        description: "Find food options, canteen services, and places to eat.",
        href: "/food",
        category: "Food",
        keywords: ["food", "canteen", "eat", "cafe", "coffee", "lunch"],
    },
    {
        title: "Help Desk",
        description: "Access support services, advice, and student assistance.",
        href: "/helpdesk",
        category: "Support",
        keywords: ["help", "support", "help desk", "wellbeing", "advice"],
    },
    {
        title: "Contact Us",
        description: "Get in touch with the university or app support team.",
        href: "/contact",
        category: "Support",
        keywords: ["contact", "email", "phone", "message", "help"],
    },
    {
        title: "Sign In",
        description: "Access your account and personalised campus features.",
        href: "/login",
        category: "Account",
        keywords: ["login", "sign in", "account", "profile"],
    },  
];
