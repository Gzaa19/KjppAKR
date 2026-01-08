"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Clock, Phone, Menu, X, ChevronDown } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
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
            {/* Top Bar - Visible on all screens */}
            <div className="bg-navbar-topbar text-white py-2 md:py-3">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-end text-xs lg:text-sm gap-4 lg:gap-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-kjpp-red" />
                            <span className="hidden lg:inline">Permata Kebayoran Plaza Blok A-11</span>
                            <span className="lg:hidden">Jakarta Selatan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-kjpp-red" />
                            <span>Mon - Fri 8.00 - 17.00</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 lg:w-4 lg:h-4 text-kjpp-red" />
                            <span className="hidden lg:inline">021-7268181 | 021-7227643</span>
                            <span className="lg:hidden">021-7268181</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className={cn(
                "bg-white border-b transition-shadow duration-300",
                isScrolled ? "shadow-md" : "shadow-sm"
            )}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/image/logoAKR.png"
                                alt="AKR Logo"
                                width={120}
                                height={60}
                                className="object-contain lg:w-[150px] lg:h-[75px]"
                                priority
                            />
                        </Link>
                        <NavigationMenu className="hidden lg:flex">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            isActive("/") && "text-kjpp-red"
                                        )}
                                    >
                                        Home
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={isActive("/tentang") ? "text-kjpp-red" : ""}>
                                        Tentang Kami
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                            <ListItem
                                                href="/tentang-kami/sekapur-sirih"
                                                title="Sekapur Sirih"
                                                isActive={isActive("/tentang-kami/sekapur-sirih")}
                                            >
                                                Sejarah Perusahaan
                                            </ListItem>
                                            <ListItem
                                                href="/tentang-kami/visi-misi"
                                                title="Visi Misi"
                                                isActive={isActive("/tentang-kami/visi-misi")}
                                            >
                                                Visi dan Misi Perusahaan
                                            </ListItem>
                                            <ListItem
                                                href="/tentang-kami/manajemen"
                                                title="Manajemen"
                                                isActive={isActive("/tentang-kami/manajemen")}
                                            >
                                                Struktur Manajemen
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={isActive("/layanan") ? "text-kjpp-red" : ""}>
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
                                            isActive("/klien") && "text-kjpp-red"
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
                                            isActive("/galeri") && "text-kjpp-red"
                                        )}
                                    >
                                        Galeri
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/news"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            isActive("/news") && "text-kjpp-red"
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
                                            isActive("/hubungi-kami") && "text-kjpp-red"
                                        )}
                                    >
                                        Hubungi Kami
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* Mobile Menu Button */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                                <nav className="flex flex-col gap-4 mt-10">
                                    <Link
                                        href="/"
                                        className={cn(
                                            "text-lg font-semibold py-2 px-4 rounded-lg transition-colors",
                                            isActive("/") ? "text-kjpp-red bg-red-50" : "text-gray-700 hover:bg-gray-100"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Home
                                    </Link>
                                    <Collapsible>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100">
                                            Tentang Kami
                                            <ChevronDown className="h-4 w-4" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="pl-4 mt-2 space-y-2">
                                            <Link
                                                href="/tentang/profil"
                                                className={cn(
                                                    "block py-2 px-4 rounded-lg text-sm",
                                                    isActive("/tentang/profil") ? "text-kjpp-red bg-red-50" : "text-gray-600 hover:bg-gray-100"
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Profil Perusahaan
                                            </Link>
                                            <Link
                                                href="/tentang-kami/manajemen"
                                                className={cn(
                                                    "block py-2 px-4 rounded-lg text-sm",
                                                    isActive("/tentang-kami/manajemen") ? "text-kjpp-red bg-red-50" : "text-gray-600 hover:bg-gray-100"
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Manajemen
                                            </Link>
                                            <Link
                                                href="/tentang/sertifikasi"
                                                className={cn(
                                                    "block py-2 px-4 rounded-lg text-sm",
                                                    isActive("/tentang/sertifikasi") ? "text-kjpp-red bg-red-50" : "text-gray-600 hover:bg-gray-100"
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Sertifikasi
                                            </Link>
                                            <Link
                                                href="/tentang/karir"
                                                className={cn(
                                                    "block py-2 px-4 rounded-lg text-sm",
                                                    isActive("/tentang/karir") ? "text-kjpp-red bg-red-50" : "text-gray-600 hover:bg-gray-100"
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Karir
                                            </Link>
                                        </CollapsibleContent>
                                    </Collapsible>
                                    <Collapsible>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100">
                                            Jasa Layanan
                                            <ChevronDown className="h-4 w-4" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="pl-4 mt-2 space-y-2">
                                            <Link
                                                href="/layanan/penilaian"
                                                className={cn(
                                                    "block py-2 px-4 rounded-lg text-sm",
                                                    isActive("/layanan/penilaian") ? "text-kjpp-red bg-red-50" : "text-gray-600 hover:bg-gray-100"
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Penilaian Properti
                                            </Link>
                                            <Link
                                                href="/layanan/konsultasi"
                                                className={cn(
                                                    "block py-2 px-4 rounded-lg text-sm",
                                                    isActive("/layanan/konsultasi") ? "text-kjpp-red bg-red-50" : "text-gray-600 hover:bg-gray-100"
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Konsultasi
                                            </Link>
                                            <Link
                                                href="/layanan/audit"
                                                className={cn(
                                                    "block py-2 px-4 rounded-lg text-sm",
                                                    isActive("/layanan/audit") ? "text-kjpp-red bg-red-50" : "text-gray-600 hover:bg-gray-100"
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Audit Properti
                                            </Link>
                                            <Link
                                                href="/layanan/riset"
                                                className={cn(
                                                    "block py-2 px-4 rounded-lg text-sm",
                                                    isActive("/layanan/riset") ? "text-kjpp-red bg-red-50" : "text-gray-600 hover:bg-gray-100"
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Riset Pasar
                                            </Link>
                                        </CollapsibleContent>
                                    </Collapsible>
                                    <Link
                                        href="/klien"
                                        className={cn(
                                            "text-lg font-semibold py-2 px-4 rounded-lg transition-colors",
                                            isActive("/klien") ? "text-kjpp-red bg-red-50" : "text-gray-700 hover:bg-gray-100"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Klien
                                    </Link>
                                    <Link
                                        href="/galeri"
                                        className={cn(
                                            "text-lg font-semibold py-2 px-4 rounded-lg transition-colors",
                                            isActive("/galeri") ? "text-kjpp-red bg-red-50" : "text-gray-700 hover:bg-gray-100"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Galeri
                                    </Link>
                                    <Link
                                        href="/berita"
                                        className={cn(
                                            "text-lg font-semibold py-2 px-4 rounded-lg transition-colors",
                                            isActive("/berita") ? "text-kjpp-red bg-red-50" : "text-gray-700 hover:bg-gray-100"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Berita
                                    </Link>
                                    <Link
                                        href="/hubungi-kami"
                                        className={cn(
                                            "text-lg font-semibold py-2 px-4 rounded-lg transition-colors",
                                            isActive("/hubungi-kami") ? "text-kjpp-red bg-red-50" : "text-gray-700 hover:bg-gray-100"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Hubungi Kami
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}

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
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-kjpp-red focus:text-kjpp-red",
                        isActive && "text-kjpp-red",
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
