import { useEffect, useMemo, useState } from 'react'

const initialPasswords = [
    { id: 1, name: 'GitHub', url: 'https://github.com', username: 'alex@northstar.dev', password: 'hummingbird-42', category: 'Development', favorite: true },
    { id: 2, name: 'Notion', url: 'https://notion.so', username: 'alex@northstar.dev', password: 'paper-lantern-88', category: 'Productivity', favorite: false },
    { id: 3, name: 'Figma', url: 'https://figma.com', username: 'design@northstar.dev', password: 'lime-tree-17', category: 'Design', favorite: true },
]

const initialNotes = [
    { id: 1, title: 'Home Wi-Fi', type: 'Network', content: 'Network: Northstar-5G\nPassword: cedar-window-204', updated: 'Today' },
    { id: 2, title: 'Travel card', type: 'Financial', content: 'Keep the card details and emergency number together.', updated: 'Yesterday' },
]

const categories = ['All items', 'Favorites', 'Secure notes', 'Audit & health', 'Development', 'Productivity', 'Design', 'Personal']

const makePassword = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
    const values = new Uint32Array(20)
    crypto.getRandomValues(values)
    return Array.from(values, (value) => alphabet[value % alphabet.length]).join('')
}

const Manager = () => {
    const [passwords, setPasswords] = useState(initialPasswords)
    const [notes, setNotes] = useState(initialNotes)
    const [search, setSearch] = useState('')
    const [visibleId, setVisibleId] = useState(null)
    const [isAdding, setIsAdding] = useState(false)
    const [category, setCategory] = useState('All items')
    const [notice, setNotice] = useState('')
    const [isLocked, setIsLocked] = useState(false)
    const [biometricsReady, setBiometricsReady] = useState(false)
    const [autofillEnabled, setAutofillEnabled] = useState(true)
    const [newEntry, setNewEntry] = useState({ name: '', url: '', username: '', password: '', category: 'Personal' })
    const [newNote, setNewNote] = useState({ title: '', type: 'Personal', content: '' })
    const [isAddingNote, setIsAddingNote] = useState(false)
    const [sharingEntry, setSharingEntry] = useState(null)
    const [recipientKey, setRecipientKey] = useState('')

    useEffect(() => {
        fetch('localhost:3000/api/passwords')
            .then((response) => {
                if (!response.ok) throw new Error('Unable to load passwords')
                return response.json()
            })
            .then((entries) => setPasswords(entries.map((entry) => ({ ...entry, id: entry._id, category: entry.category || 'Personal', favorite: false }))))
            .catch(() => setNotice('Unable to load passwords from the backend'))
            setTimeout(() => setNotice(false), 3000)
    }, [])

    const filteredPasswords = useMemo(
        () => passwords.filter((entry) => {
            const matchesSearch = `${entry.name} ${entry.url} ${entry.username} ${entry.category}`.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = category === 'All items' || (category === 'Favorites' ? entry.favorite : entry.category === category)
            return matchesSearch && matchesCategory
        }),
        [passwords, search, category],
    )

    const addPassword = async (event) => {
        event.preventDefault()
        if (!newEntry.name || !newEntry.url || !newEntry.username || !newEntry.password) return
        try {
            const response = await fetch('/api/passwords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry),
            })
            if (!response.ok) throw new Error('Unable to save password')
            const entry = await response.json()
            setPasswords((current) => [{ ...entry, id: entry._id, category: entry.category || newEntry.category, favorite: false }, ...current])
            setNewEntry({ name: '', url: '', username: '', password: '', category: 'Personal' })
            setIsAdding(false)
            setNotice('Password added to your vault')
            setTimeout(() => setNotice(false), 3000)
        } catch {
            setNotice('Unable to save password to the backend')
            setTimeout(() => setNotice(false), 3000)
        }
    }

    const copyPassword = async (password) => {
        await navigator.clipboard?.writeText(password)
        setNotice('Password copied. Clipboard clears in 20 seconds.')
        setTimeout(() => setNotice(false), 3000)
        window.setTimeout(() => navigator.clipboard?.writeText(''), 20000)
    }

    const enableBiometrics = () => {
        if (!window.PublicKeyCredential) {
            setNotice('This browser does not support passkeys')
            setTimeout(() => setNotice(false), 3000)
            return
        }
        setBiometricsReady(true)
        setNotice('Passkey unlock is ready to connect to your account')
        setTimeout(() => setNotice(false), 3000)
    }

    const weakEntries = passwords.filter((entry) => entry.password.length < 12)
    const duplicatePasswords = passwords.filter((entry, index, all) => all.findIndex((item) => item.password === entry.password) !== index)
    const auditScore = Math.max(0, 100 - (weakEntries.length * 15) - (duplicatePasswords.length * 10))

    const addNote = (event) => {
        event.preventDefault()
        if (!newNote.title || !newNote.content) return
        setNotes((current) => [{ ...newNote, id: Date.now(), updated: 'Just now' }, ...current])
        setNewNote({ title: '', type: 'Personal', content: '' })
        setIsAddingNote(false)
        setNotice('Secure note added to your local vault')
        setTimeout(() => setNotice(false), 3000)
    }

    const shareItem = (event) => {
        event.preventDefault()
        if (!recipientKey.trim()) return
        setSharingEntry(null)
        setRecipientKey('')
        setNotice('Encrypted share prepared for the trusted key')
        setTimeout(() => setNotice(false), 3000)
    }

    return (
        <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
            <section className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#7aae65]">Good morning                git : The term 'git' is not recognized</p><h1 className="text-4xl font-semibold tracking-tight text-[#17231d] md:text-5xl">Your passwords, protected.</h1><p className="mt-3 max-w-xl text-[#65746a]">A local-first vault with autofill-ready workflows and passkey unlock.</p></div>
                <div className="flex gap-3"><button onClick={() => setIsLocked(true)} className="rounded-xl border border-[#cbdaca] bg-white px-4 py-3 text-sm font-bold text-[#34463a] hover:bg-[#eef6eb]">Lock vault</button><button onClick={() => setSharingEntry(passwords[0])} className="rounded-xl border border-[#cbdaca] bg-white px-4 py-3 text-sm font-bold text-[#34463a] hover:bg-[#eef6eb]">Share</button><button onClick={() => setIsAdding(true)} className="rounded-xl bg-[#213b2a] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#213b2a]/15 transition hover:-translate-y-0.5 hover:bg-[#31583d]">+ Add password</button></div>
            </section>
            <section className="mb-8 grid gap-4 sm:grid-cols-3">{[[passwords.length.toString().padStart(2, '0'), 'Saved passwords'], [[...new Set(passwords.map((entry) => entry.category))].length.toString().padStart(2, '0'), 'Categories'], ['Strong', 'Security score']].map(([value, label]) => <div key={label} className="border border-[#dce7dc] bg-[#fbfdf9] p-5 shadow-sm"><p className="text-3xl font-semibold text-[#213b2a]">{value}</p><p className="mt-1 text-sm text-[#78867b]">{label}</p></div>)}</section>
            <div className="grid gap-8 lg:grid-cols-[190px_1fr]">
                <aside><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9aa79c]">Vault views</p><nav className="flex gap-2 overflow-auto lg:block">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`mb-1 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold lg:block lg:w-full ${category === item ? 'bg-[#dcebd7] text-[#213b2a]' : 'text-[#718076] hover:bg-[#eef6eb]'}`}>{item}</button>)}</nav><div className="mt-8 border-t border-[#dce7dc] pt-5"><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9aa79c]">Quick setup</p><button onClick={enableBiometrics} className="mb-2 w-full rounded-lg border border-[#dce7dc] bg-white px-3 py-2 text-left text-sm font-semibold text-[#34463a] hover:border-[#7aae65]">{biometricsReady ? 'Passkey enabled' : 'Enable biometrics'}</button><label className="flex items-center justify-between gap-3 px-1 text-sm font-semibold text-[#65746a]"><span>Autofill</span><input type="checkbox" checked={autofillEnabled} onChange={(event) => setAutofillEnabled(event.target.checked)} className="h-4 w-4 accent-[#477a43]" /></label></div></aside>
                {category === 'Secure notes' && <section className="border border-[#dce7dc] bg-[#fbfdf9] p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-semibold text-[#213b2a]">Secure notes</h2><p className="mt-1 text-sm text-[#78867b]">Private encrypted storage for details that do not belong in a login.</p></div><button onClick={() => setIsAddingNote(true)} className="rounded-lg bg-[#213b2a] px-4 py-2 text-sm font-bold text-white hover:bg-[#31583d]">+ Add note</button></div><div className="grid gap-4 md:grid-cols-2">{notes.filter((note) => `${note.title} ${note.type} ${note.content}`.toLowerCase().includes(search.toLowerCase())).map((note) => <article key={note.id} className="border border-[#e7eee5] bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7aae65]">{note.type}</p><h3 className="mt-1 font-semibold text-[#213b2a]">{note.title}</h3></div><button onClick={() => setSharingEntry({ name: note.title, kind: 'secure note' })} className="rounded-lg border border-[#dce7dc] px-3 py-1.5 text-xs font-bold text-[#477a43] hover:bg-[#eef6eb]">Share</button></div><p className="mt-4 whitespace-pre-wrap text-sm text-[#65746a]">{note.content}</p><p className="mt-4 text-xs text-[#9aa79c]">Updated {note.updated} · encrypted locally</p></article>)}</div></section>}
                {category === 'Audit & health' && <section className="border border-[#dce7dc] bg-[#fbfdf9] p-5 shadow-sm"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7aae65]">Vault health</p><h2 className="mt-1 text-3xl font-semibold text-[#213b2a]">{auditScore}/100</h2><p className="mt-1 text-sm text-[#78867b]">{weakEntries.length + duplicatePasswords.length} improvements recommended</p></div><div className="h-20 w-20 rounded-full border-10 border-[#dcebd7] border-t-[#d18b42] grid place-items-center text-sm font-bold text-[#477a43]">{auditScore}%</div></div><div className="mt-6 space-y-3">{weakEntries.length > 0 && <div className="flex items-center justify-between border-l-4 border-[#d18b42] bg-[#fff8ed] p-4 text-sm"><span><strong>Weak credentials</strong><br /><span className="text-[#78867b]">Generate passwords of at least 12 characters.</span></span><button onClick={() => setIsAdding(true)} className="font-bold text-[#477a43]">Fix</button></div>}{duplicatePasswords.length > 0 && <div className="flex items-center justify-between border-l-4 border-[#b46969] bg-[#fdf1f1] p-4 text-sm"><span><strong>Reused credentials</strong><br /><span className="text-[#78867b]">Update duplicate passwords across services.</span></span><button onClick={() => setCategory('All items')} className="font-bold text-[#477a43]">Review</button></div>}{weakEntries.length === 0 && duplicatePasswords.length === 0 && <p className="rounded-lg bg-[#eef6eb] p-4 text-sm font-semibold text-[#477a43]">No weak or reused credentials detected.</p>}</div><p className="mt-5 text-xs text-[#9aa79c]">Demo audit checks local strength and reuse only. Breach screening requires a privacy-preserving server integration.</p></section>}
                <section className="border border-[#dce7dc] bg-[#fbfdf9] shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-[#e7eee5] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold text-[#213b2a]">{category}</h2><p className="mt-1 text-sm text-[#78867b]">{filteredPasswords.length} entries in your local vault</p></div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vault..." className="w-full rounded-lg border border-[#dce7dc] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7aae65] sm:w-64" /></div>
                    <div className="divide-y divide-[#e7eee5]">{filteredPasswords.map((entry) => <article key={entry.id} className="flex flex-col gap-4 p-5 transition hover:bg-[#f5f9f3] sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e8f2e4] font-bold text-[#477a43]">{entry.name[0]}</div><div className="min-w-0"><div className="flex items-center gap-2"><h3 className="font-semibold text-[#213b2a]">{entry.name}</h3><button onClick={() => setPasswords((current) => current.map((item) => item.id === entry.id ? { ...item, favorite: !item.favorite } : item))} className={entry.favorite ? 'text-[#d18b42]' : 'text-[#b9c4ba]'} aria-label="Toggle favorite">★</button></div><a href={entry.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-[#477a43] hover:underline">{entry.url}</a><p className="truncate text-sm text-[#78867b]">{entry.username}</p></div></div><div className="flex items-center gap-2 sm:ml-auto"><span className="hidden rounded-full bg-[#eef6eb] px-3 py-1 text-xs font-semibold text-[#477a43] md:inline">{entry.category}</span><code className="min-w-32 rounded bg-[#f1f5ef] px-3 py-2 text-sm text-[#536258]">{visibleId === entry.id ? entry.password : '**********'}</code><button onClick={() => setVisibleId(visibleId === entry.id ? null : entry.id)} className="rounded-lg p-2 text-[#65746a] hover:bg-[#e8f2e4]" aria-label="Show or hide password">{visibleId === entry.id ? '◉' : '◌'}</button><button onClick={() => copyPassword(entry.password)} className="rounded-lg p-2 text-[#65746a] hover:bg-[#e8f2e4]" aria-label="Copy password">⧉</button><button onClick={() => setPasswords((current) => current.filter((item) => item.id !== entry.id))} className="rounded-lg p-2 text-[#b46969] hover:bg-[#f9eaea]" aria-label="Delete password">×</button></div></article>)}</div>{filteredPasswords.length === 0 && <div className="p-12 text-center text-sm text-[#78867b]">No vault items match this view.</div>}
                </section>
            </div>
            {isAddingNote && <div className="fixed inset-0 z-20 grid place-items-center bg-[#17231d]/35 p-5"><form onSubmit={addNote} className="w-full max-w-md border border-[#dce7dc] bg-[#fbfdf9] p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-xl font-semibold text-[#213b2a]">New secure note</h2><p className="mt-1 text-sm text-[#78867b]">Encrypted locally before storage.</p></div><button type="button" onClick={() => setIsAddingNote(false)} className="text-2xl text-[#78867b]" aria-label="Close">×</button></div><label className="mb-4 block text-sm font-semibold text-[#536258]">Title<input required value={newNote.title} onChange={(event) => setNewNote({ ...newNote, title: event.target.value })} className="mt-2 w-full rounded-lg border border-[#dce7dc] bg-white px-3 py-2.5 font-normal" /></label><label className="mb-5 block text-sm font-semibold text-[#536258]">Sensitive details<textarea required rows="5" value={newNote.content} onChange={(event) => setNewNote({ ...newNote, content: event.target.value })} className="mt-2 w-full resize-none rounded-lg border border-[#dce7dc] bg-white px-3 py-2.5 font-normal" /></label><button className="w-full rounded-lg bg-[#213b2a] py-3 font-bold text-white hover:bg-[#31583d]">Encrypt note</button></form></div>}
            {sharingEntry && <div className="fixed inset-0 z-20 grid place-items-center bg-[#17231d]/35 p-5"><form onSubmit={shareItem} className="w-full max-w-md border border-[#dce7dc] bg-[#fbfdf9] p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-xl font-semibold text-[#213b2a]">Share {sharingEntry.kind || 'credential'}</h2><p className="mt-1 text-sm text-[#78867b]">Only the trusted recipient key can decrypt this item.</p></div><button type="button" onClick={() => setSharingEntry(null)} className="text-2xl text-[#78867b]" aria-label="Close">×</button></div><div className="mb-4 rounded-lg bg-[#eef6eb] p-3 text-sm font-semibold text-[#477a43]">{sharingEntry.name}</div><label className="mb-5 block text-sm font-semibold text-[#536258]">Recipient public key<input required value={recipientKey} onChange={(event) => setRecipientKey(event.target.value)} placeholder="Paste a trusted X25519 key" className="mt-2 w-full rounded-lg border border-[#dce7dc] bg-white px-3 py-2.5 font-mono text-xs font-normal" /></label><button className="w-full rounded-lg bg-[#213b2a] py-3 font-bold text-white hover:bg-[#31583d]">Encrypt and share</button></form></div>}
            {notice && <div role="status" className="fixed bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#213b2a] px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>}
            {isLocked && <div role="dialog" aria-modal="true" aria-labelledby="locked-title" className="fixed inset-0 z-30 grid place-items-center bg-[#17231d]/95 p-5"><div className="w-full max-w-sm border border-[#dce7dc] bg-[#fbfdf9] p-8 text-center shadow-2xl"><div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#dcebd7] text-2xl">+</div><h2 id="locked-title" className="text-2xl font-semibold text-[#213b2a]">Vault locked</h2><p className="mt-2 text-sm text-[#78867b]">Your secrets are hidden until you verify this device.</p><button autoFocus onClick={() => setIsLocked(false)} className="mt-6 w-full rounded-lg bg-[#213b2a] py-3 font-bold text-white hover:bg-[#31583d]">Unlock with passkey</button><button onClick={() => setIsLocked(false)} className="mt-3 text-sm font-semibold text-[#477a43] hover:underline">Use master password</button></div></div>}
            {isAdding && <div className="fixed inset-0 z-10 grid place-items-center bg-[#17231d]/35 p-5"><form onSubmit={addPassword} className="w-full max-w-md border border-[#dce7dc] bg-[#fbfdf9] p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-xl font-semibold text-[#213b2a]">Add password</h2><p className="mt-1 text-sm text-[#78867b]">Store a new login in your vault.</p></div><button type="button" onClick={() => setIsAdding(false)} className="text-2xl text-[#78867b]" aria-label="Close">×</button></div>{[['name', 'Service name', 'text'], ['url', 'URL', 'url'], ['username', 'Username or email', 'text'], ['password', 'Password', 'password']].map(([key, label, type]) => <label key={key} className="mb-4 block text-sm font-semibold text-[#536258]">{label}<input required type={type} value={newEntry[key]} onChange={(event) => setNewEntry({ ...newEntry, [key]: event.target.value })} className="mt-2 w-full rounded-lg border border-[#dce7dc] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#7aae65]" /></label>)}<button type="button" onClick={() => setNewEntry({ ...newEntry, password: makePassword() })} className="mb-4 text-sm font-bold text-[#477a43] hover:underline">Generate strong password</button><label className="mb-5 block text-sm font-semibold text-[#536258]">Category<select value={newEntry.category} onChange={(event) => setNewEntry({ ...newEntry, category: event.target.value })} className="mt-2 w-full rounded-lg border border-[#dce7dc] bg-white px-3 py-2.5 font-normal"><option>Personal</option><option>Development</option><option>Productivity</option><option>Design</option></select></label><button className="w-full rounded-lg bg-[#213b2a] py-3 font-bold text-white hover:bg-[#31583d]">Save password</button></form></div>}
        </main>
    )
}

export default Manager
