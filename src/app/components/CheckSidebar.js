'use client'
import Sidebar from "./Sidebar"
import { usePathname } from "next/navigation"

export default function CheckSidebar({children}) {
    const pathname = usePathname()
    const hideSideBar = pathname == '/login' || pathname == '/signup' || pathname == '/confirm-email' 
        return (
        <>
        {!hideSideBar && <Sidebar/>}
        <main>{children}</main>
        </>
    )
}