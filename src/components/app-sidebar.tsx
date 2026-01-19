"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import {
    LayoutDashboard,
    FileText,
    LogOut,
    Building2,
    Users,
    Map,
    Image as ImageIcon,
    Settings2,
    FolderKanban,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserSession = {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar: string | null;
};

type MenuItem = {
    title: string;
    url: string;
    icon: React.ElementType;
};

type MenuGroup = {
    label: string;
    items: MenuItem[];
};

// Portal menu configuration
const portalMenuConfig: MenuGroup[] = [
    {
        label: "Platform",
        items: [
            { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        label: "Master Data",
        items: [
            { title: "Manajemen", url: "/admin/management", icon: Users },
            { title: "Klien", url: "/admin/clients", icon: Building2 },
        ],
    },
    {
        label: "Website CMS",
        items: [
            { title: "Publikasi", url: "/admin/publikasi", icon: FileText },
            { title: "Galeri", url: "/admin/gallery", icon: Map },
            { title: "Hero Images", url: "/admin/hero-images", icon: ImageIcon },
        ],
    },
];

// Tracking menu configuration
const trackingMenuConfig: MenuGroup[] = [
    {
        label: "Platform",
        items: [
            { title: "Dashboard", url: "/admin/tracking", icon: LayoutDashboard },
        ],
    },
    {
        label: "Master Data",
        items: [
            { title: "Klien", url: "/admin/tracking/clients", icon: Users },
            { title: "Proyek", url: "/admin/tracking/projects", icon: FolderKanban },
        ],
    },
];

// Sidebar variant configurations
const sidebarConfig = {
    portal: {
        subtitle: "Admin Portal",
        homeUrl: "/admin/dashboard",
        menuGroups: portalMenuConfig,
        logoSize: { expanded: 12, collapsed: 8 },
        logoStyle: "static", // static = larger logo, clickable = smaller with link
    },
    tracking: {
        subtitle: "Tracking System",
        homeUrl: "/admin/tracking",
        menuGroups: trackingMenuConfig,
        logoSize: { expanded: 12, collapsed: 8 },
        logoStyle: "static",
    },
};

type PortalType = keyof typeof sidebarConfig;

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    portalType?: PortalType;
}

export function AppSidebar({ portalType = "portal", ...props }: AppSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = React.useState<UserSession | null>(null)
    const [isLoggingOut, setIsLoggingOut] = React.useState(false)

    const config = sidebarConfig[portalType];

    React.useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch("/api/auth/session")
                const data = await res.json()
                if (data.success) {
                    setUser(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch session:", error)
            }
        }
        fetchSession()
    }, [])

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            toast.success("Anda sudah selesai bekerja. Sampai jumpa kembali! 👋", {
                description: "Terima kasih atas kerja keras Anda hari ini"
            })
            router.push("/admin/login")
            router.refresh()
        } catch (error) {
            console.error("Logout failed:", error)
            toast.error("Gagal logout. Silakan coba lagi.")
        } finally {
            setIsLoggingOut(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const menuButtonClass = "text-slate-600 hover:text-slate-900 hover:bg-slate-100 data-[active=true]:bg-[#1e293b] data-[active=true]:text-white data-[active=true]:hover:bg-[#1e293b] data-[active=true]:hover:text-white font-medium transition-all duration-200";
    const groupLabelClass = "text-xs font-bold uppercase tracking-wider text-slate-400 px-4 mb-2 mt-4";

    const isMenuActive = (url: string) => {
        // Special handling for dashboard routes (exact match)
        if (url === "/admin/dashboard" || url === "/admin/tracking") {
            return pathname === url;
        }
        return pathname.startsWith(url);
    };

    const renderMenu = (items: MenuItem[]) => (
        <SidebarMenu className="px-2">
            {items.map((item) => {
                const isActive = isMenuActive(item.url);

                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.title}
                            className={menuButtonClass}
                        >
                            <a href={item.url}>
                                <item.icon className="h-5 w-5" />
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )
            })}
        </SidebarMenu>
    );

    const renderLogo = () => {
        if (config.logoStyle === "static") {
            return (
                <div className="flex items-center gap-3 px-2 py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                    <div className="flex aspect-square size-12 group-data-[collapsible=icon]:size-8 items-center justify-center rounded-lg shrink-0">
                        <Image
                            src="/image/logoAKR.png"
                            alt="KJPP AKR Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-bold text-lg">KJPP AKR</span>
                        <span className="truncate text-sm font-medium">{config.subtitle}</span>
                    </div>
                </div>
            );
        }

        // Clickable logo style
        return (
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                <a href={config.homeUrl} className="flex items-center gap-3">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white border border-slate-100 shadow-sm p-1 md:size-10 md:rounded-xl md:p-1.5 shrink-0">
                        <Image
                            src="/image/logoAKR.png"
                            alt="KJPP AKR Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                    <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="text-slate-800 font-bold">KJPP AKR</span>
                        <span className="text-slate-500 font-medium text-xs">{config.subtitle}</span>
                    </div>
                </a>
            </SidebarMenuButton>
        );
    };

    return (
        <Sidebar collapsible="icon" className="bg-white border-r border-slate-100" {...props}>
            <SidebarHeader className="p-4 pb-2 group-data-[collapsible=icon]:p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        {renderLogo()}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
                {config.menuGroups.map((group: MenuGroup) => (
                    <SidebarGroup key={group.label} className="p-0">
                        <SidebarGroupLabel className={groupLabelClass}>{group.label}</SidebarGroupLabel>
                        {renderMenu(group.items)}
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="p-4 pt-2 group-data-[collapsible=icon]:p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl px-3"
                                    suppressHydrationWarning
                                >
                                    <Avatar className="h-8 w-8 rounded-full border border-white shadow-sm">
                                        <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                                        <AvatarFallback className="rounded-full bg-slate-200 text-slate-600">
                                            {user ? getInitials(user.name) : "AD"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                                        <span className="truncate font-bold text-slate-800">{user?.name || "Loading..."}</span>
                                        <span className="truncate text-xs text-slate-500">{user?.email || ""}</span>
                                    </div>
                                    <Settings2 className="ml-auto size-4 text-slate-400" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                                            <AvatarFallback className="rounded-lg">
                                                {user ? getInitials(user.name) : "AD"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user?.name}</span>
                                            <span className="truncate text-xs">{user?.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                >
                                    <LogOut className="mr-2" />
                                    {isLoggingOut ? "Logging out..." : "Log out"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    )
}
