export function Header({ isLoggedIn, onLoginClick, onLogoClick }) {
    return (
        <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
                    <span className="text-3xl">🍿</span>
                    <h1 className="text-2xl font-bold tracking-tighter text-white">
                        Cine<span className="text-brand">Reserve</span>
                    </h1>
                </div>

                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <span className="text-zinc-400 text-sm hidden md:block">Olá, Cinéfilo</span>
                        <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold">
                            C
                        </div>
                    </div>
                ) : (
                    <button onClick={onLoginClick} className="text-sm font-medium bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 rounded-lg border border-zinc-800 transition-colors">
                        Entrar
                    </button>
                )}
            </div>
        </header>
    )
}

export function LoginModal({ isOpen, onClose, onLogin, isLoading }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 flex justify-between items-center border-b border-zinc-800">
                    <h3 className="text-xl font-bold text-white">Acesse sua conta</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
                </div>
                <form onSubmit={onLogin} className="p-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Usuário</label>
                            <input type="text" name="username" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Senha</label>
                            <input type="password" name="password" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors" />
                        </div>
                    </div>
                    <button disabled={isLoading} type="submit" className="w-full mt-8 bg-brand hover:bg-brand-hover text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50">
                        {isLoading ? 'A entrar...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export function TicketSuccess({ ticket, onHomeClick }) {
    if (!ticket) return null

    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-md mx-auto mt-10">
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Pagamento Aprovado!</h2>
                <p className="text-zinc-400">Seu ingresso foi emitido com sucesso.</p>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-zinc-950 rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-zinc-950 rounded-full"></div>

                <div className="p-8 border-b-2 border-dashed border-zinc-300">
                    <span className="text-brand font-black tracking-widest uppercase text-xs">CineReserve</span>
                    <h3 className="text-3xl font-black text-zinc-900 mt-2 mb-6 leading-tight">{ticket.movie}</h3>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Data / Hora</p>
                            <p className="text-zinc-900 font-bold text-lg">Hoje, {ticket.time}</p>
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Local</p>
                            <p className="text-zinc-900 font-bold text-lg">{ticket.room}</p>
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Assento</p>
                            <p className="text-brand font-black text-3xl">{ticket.seat}</p>
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Pedido</p>
                            <p className="text-zinc-900 font-mono font-bold mt-2">#{ticket.orderId}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-100 p-8 flex flex-col items-center justify-center">
                    <div className="w-full h-16 bg-zinc-900 flex items-center justify-between px-2 opacity-80">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className={`h-full bg-white ${i % 2 === 0 ? 'w-2' : i % 3 === 0 ? 'w-4' : 'w-1'}`}></div>
                        ))}
                    </div>
                    <p className="text-zinc-400 text-xs mt-4 uppercase tracking-widest font-mono">{ticket.orderId}</p>
                </div>
            </div>

            <button onClick={onHomeClick} className="w-full mt-8 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl transition-colors border border-zinc-800">
                Voltar ao Início
            </button>
        </div>
    )
}