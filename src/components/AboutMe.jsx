const AboutMe = () => {
    return (
        <main className="relative overflow-hidden border-t border-[#dce7dc] bg-[#f8fbf6]">
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border-32 border-[#e2efdc] opacity-70" />
            <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
                <section className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <div className="relative mx-auto w-full max-w-sm">
                        <div className="absolute -inset-4 rounded-full border border-[#bdd5b4]" />
                        <div className="relative aspect-square overflow-hidden rounded-full border-12 border-white bg-[#dcebd7] shadow-xl shadow-[#477a43]/10">
                            <div className="grid h-full w-full place-items-center bg-[#dcebd7] text-8xl font-semibold text-[#477a43]" aria-label="Farhan Ali">
                              <img src="/1764742322513.jpg" alt="Farhan Ali" className="h-100 w-full object-cover" />
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#c9dec3] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#477a43] shadow-sm">
                            Building with intent
                        </div>
                    </div>
                    <div>
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#7aae65]">About me</p>
                        <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-[#17231d] md:text-6xl">Hi, I&apos;m Farhan Ali.</h1>
                        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[#536258]">A full-stack MERN developer and cloud engineer focused on building dependable products that make complex technology feel clear, useful, and human.</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {['React + Node.js', 'MongoDB architecture', 'Cloud infrastructure'].map((skill) => <span key={skill} className="rounded-full border border-[#c9dec3] bg-white px-4 py-2 text-sm font-semibold text-[#34463a]">{skill}</span>)}
                        </div>
                    </div>
                </section>

                <section className="mt-24 grid gap-8 border-t border-[#dce7dc] pt-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#7aae65]">The project vision</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#213b2a] md:text-4xl">Privacy should be the default.</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <p className="text-lg leading-relaxed text-[#536258]">This project is a secure, local-first password vault designed to put ownership back in the user&apos;s hands. Secrets should remain encrypted on the device, available when needed, and invisible to everyone else.</p>
                        <div className="border-l-2 border-[#7aae65] pl-6">
                            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#477a43]">A better standard</p>
                            <p className="mt-3 leading-relaxed text-[#65746a]">Zero-knowledge encryption, thoughtful recovery, passkey-ready access, and calm security guidance in one focused experience.</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default AboutMe
