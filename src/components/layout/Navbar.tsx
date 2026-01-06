"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Clock, Phone } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(path);
    };

    return (
        <header className="w-full sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-[var(--navbar-topbar)] text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-end text-sm gap-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span>Permata Kebayoran Plaza Blok A-11</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-500" />
                            <span>Mon - Fri 8.00 - 17.00</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-500" />
                            <span>021-7268181 | 021-7227643</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn(
                "bg-white border-b transition-shadow duration-300",
                isScrolled ? "shadow-md" : "shadow-sm"
            )}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/image/logoAKR.png"
                                alt="AKR Logo"
                                width={150}
                                height={75}
                                className="object-contain"
                                priority
                            />
                        </Link>

                        {/* Navigation Menu */}
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            isActive("/") && "text-[var(--color-navbar-text-link-hover)]"
                                        )}
                                    >
                                        Home
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={isActive("/tentang") ? "text-[var(--color-navbar-text-link-hover)]" : ""}>
                                        Tentang Kami
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                            <ListItem
                                                href="/tentang/profil"
                                                title="Profil Perusahaan"
                                                isActive={isActive("/tentang/profil")}
                                            >
                                                Sejarah dan visi misi perusahaan
                                            </ListItem>
                                            <ListItem
                                                href="/tentang/tim"
                                                title="Tim Kami"
                                                isActive={isActive("/tentang/tim")}
                                            >
                                                Kenali tim profesional kami
                                            </ListItem>
                                            <ListItem
                                                href="/tentang/sertifikasi"
                                                title="Sertifikasi"
                                                isActive={isActive("/tentang/sertifikasi")}
                                            >
                                                Sertifikasi dan penghargaan
                                            </ListItem>
                                            <ListItem
                                                href="/tentang/karir"
                                                title="Karir"
                                                isActive={isActive("/tentang/karir")}
                                            >
                                                Bergabung dengan tim kami
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={isActive("/layanan") ? "text-[var(--color-navbar-text-link-hover)]" : ""}>
                                        Jasa Layanan
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                            <ListItem
                                                href="/layanan/penilaian"
                                                title="Penilaian Properti"
                                                isActive={isActive("/layanan/penilaian")}
                                            >
                                                Jasa penilaian properti profesional
                                            </ListItem>
                                            <ListItem
                                                href="/layanan/konsultasi"
                                                title="Konsultasi"
                                                isActive={isActive("/layanan/konsultasi")}
                                            >
                                                Konsultasi properti dan investasi
                                            </ListItem>
                                            <ListItem
                                                href="/layanan/audit"
                                                title="Audit Properti"
                                                isActive={isActive("/layanan/audit")}
                                            >
                                                Audit dan evaluasi properti
                                            </ListItem>
                                            <ListItem
                                                href="/layanan/riset"
                                                title="Riset Pasar"
                                                isActive={isActive("/layanan/riset")}
                                            >
                                                Riset dan analisis pasar properti
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/klien"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            isActive("/klien") && "text-[var(--color-navbar-text-link-hover)]"
                                        )}
                                    >
                                        Klien
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/galeri"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            isActive("/galeri") && "text-[var(--color-navbar-text-link-hover)]"
                                        )}
                                    >
                                        Galeri
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/berita"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            isActive("/berita") && "text-[var(--color-navbar-text-link-hover)]"
                                        )}
                                    >
                                        Berita
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/hubungi-kami"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            isActive("/hubungi-kami") && "text-[var(--color-navbar-text-link-hover)]"
                                        )}
                                    >
                                        Hubungi Kami
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}

// ListItem component untuk dropdown menu
const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string; isActive?: boolean }
>(({ className, title, children, href, isActive, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    href={href ?? "#"}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-[var(--color-navbar-text-link-hover)] focus:text-[var(--color-navbar-text-link-hover)]",
                        isActive && "text-[var(--color-navbar-text-link-hover)]",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
