import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-black border-r border-zinc-800 ">
        <div className="flex flex-col items-center justify-center h-16 pt-10">
            <Image
                src="/logo.png"
                alt="Studify AI Logo"
                width={80}
                height={80}
            />
            <h2 className="text-zinc-500">
                Past Studies
            </h2>
        </div>
    </aside>
  )
}