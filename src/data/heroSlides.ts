export interface HeroSlide {
    id: number;
    image: string;
    alt: string;
}

export const heroSlides: HeroSlide[] = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
        alt: "Modern office building exterior",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
        alt: "Professional workspace interior",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
        alt: "Business meeting room",
    },
];
