const Navbar = () => {
    return (
        <nav className="border-b border-[#dce7dc] bg-[#fbfdf9] text-[#17231d]">
            <div className="mx-auto max-w-6xl px-5 py-5 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold"><span className="text-[#17231d]">&lt;</span> PASSWORD MANAGEMENT <span className="text-[#477a43]">SYSTEM/&gt;</span></div>
                    <div className="flex items-center gap-4 text-sm font-semibold text-[#65746a]"><span className="hidden sm:inline">Personal vault</span><span className="h-2 w-2 rounded-full bg-[#7aae65]" aria-label="Vault secured" /><button className="rounded-full border border-[#dce7dc] px-4 py-2 text-[#34463a] transition hover:border-[#7aae65] hover:bg-[#eef6eb]">Lock vault</button></div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar