import { SiteHeader } from "@/core/components/dashboard/site-header"
import { BottomNavigation } from "@/core/components/BottomNavigation"
import { ScrollToTop } from "@/core/components/ScrollToTop"
import { Outlet } from "react-router-dom"

export default function Dashboard() {
    return (
        <div
            className="flex h-full w-full flex-col overflow-y-auto"
            style={{ "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}
        >
            <SiteHeader />
            <ScrollToTop />
            <main className="flex-1">
                <Outlet />
            </main>
            <BottomNavigation />
        </div>
    )
}
