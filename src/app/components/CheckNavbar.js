'use client'
import Navbar from "./Navbar"
import { usePathname } from "next/navigation"

export default function CheckSidebar({children}) {
    const pathname = usePathname()
    const hideSideBar = pathname == '/login' || pathname == '/signup' || pathname == '/confirm-email'
        return (
        <>
        {!hideSideBar && <Navbar/>}
        <main>{children}</main>
        </>
    )
}