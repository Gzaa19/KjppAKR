import Image from "next/image";

interface ParallaxBackgroundProps {
    imageUrl: string;
    alt?: string;
    height?: string;
    overlayOpacity?: number;
}

export function ParallaxBackground({
    imageUrl,
    alt = "Background Image",
    height = "60vh",
    overlayOpacity = 0.4,
}: ParallaxBackgroundProps) {
    return (
        <div className={`fixed inset-x-0 top-24 z-0`} style={{ height }}>
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover"
                priority
            />
            <div
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity }}
            />
        </div>
    );
}
