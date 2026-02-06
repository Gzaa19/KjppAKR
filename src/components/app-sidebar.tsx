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
    Settings2
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

const platformMenu = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
];

const masterDataMenu = [
    {
        title: "Manajemen",
        url: "/admin/management",
        icon: Users,
    },
    {
        title: "Klien",
        url: "/admin/clients",
        icon: Building2,
    },
];

const cmsMenu = [
    {
        title: "Publikasi",
        url: "/admin/publikasi",
        icon: FileText,
    },
    {
        title: "Galeri",
        url: "/admin/gallery",
        icon: Map,
    },
    {
        title: "Banner Sekapur Sirih",
        url: "/admin/sekapur-sirih",
        icon: ImageIcon,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = React.useState<UserSession | null>(null)
    const [isLoggingOut, setIsLoggingOut] = React.useState(false)

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
    const logoTextClass = "text-slate-800 font-bold";
    const subTextClass = "text-slate-500 font-medium";

    const renderMenu = (items: typeof platformMenu) => (
        <SidebarMenu className="px-2">
            {items.map((item) => {
                const isMainActive = item.url === pathname || (item.url !== "#" && pathname.startsWith(item.url));

                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isMainActive}
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

    return (
        <Sidebar collapsible="icon" className="bg-white border-r border-slate-100" {...props}>
            <SidebarHeader className="p-4 pb-2 group-data-[collapsible=icon]:p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <a href="/admin/dashboard" className="flex items-center gap-3">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white border border-slate-100 shadow-sm p-1 md:size-10 md:rounded-xl md:p-1.5">
                                    <Image
                                        src="/image/logoAKR.png"
                                        alt="KJPP AKR Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className={logoTextClass}>KJPP AKR</span>
                                    <span className={subTextClass + " text-xs"}>Admin Portal</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
                <SidebarGroup className="p-0">
                    <SidebarGroupLabel className={groupLabelClass}>Platform</SidebarGroupLabel>
                    {renderMenu(platformMenu)}
                </SidebarGroup>

                <SidebarGroup className="p-0">
                    <SidebarGroupLabel className={groupLabelClass}>Master Data</SidebarGroupLabel>
                    {renderMenu(masterDataMenu)}
                </SidebarGroup>

                <SidebarGroup className="p-0">
                    <SidebarGroupLabel className={groupLabelClass}>Website CMS</SidebarGroupLabel>
                    {renderMenu(cmsMenu)}
                </SidebarGroup>
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
                                    onClick={() => router.push("/admin/portal-selection")}
                                    className="cursor-pointer"
                                >
                                    <Settings2 className="mr-2" />
                                    Dashboard Selection
                                </DropdownMenuItem>
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
