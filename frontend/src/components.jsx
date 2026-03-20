import { useState } from 'react'

export function Header({ isLoggedIn, username, onLoginClick, onLogoClick, onMyTicketsClick, onLogoutClick }) {
    return (
        <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
                        <span className="text-3xl">🍿</span>
                        <h1 className="text-2xl font-bold tracking-tighter text-white">
                            Cine<span className="text-brand">Reserve</span>
                        </h1>
                    </div>
                    {isLoggedIn && (
                        <button onClick={onMyTicketsClick} className="text-sm font-medium text-zinc-400 hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors">
                            Meus Tickets
                        </button>
                    )}
                </div>

                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <span className="text-zinc-400 text-sm hidden md:block">Olá, {username}</span>
                        <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <button onClick={onLogoutClick} className="text-sm font-medium text-zinc-500 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
                            Sair
                        </button>
                    </div>
                ) : (
                    <button onClick={onLoginClick} className="text-sm font-medium bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 rounded-lg border border-zinc-800 transition-colors text-white">
                        Entrar
                    </button>
                )}
            </div>
        </header>
    )
}

export function LoginModal({ isOpen, onClose, onLogin, onRegister, isLoading }) {
    const [isRegisterMode, setIsRegisterMode] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    if (!isOpen) return null

    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        setError('')
        const result = await onLogin({
            username: e.target.username.value,
            password: e.target.password.value
        })
        if (!result.success) setError(result.error)
    }

    const handleSubmitRegister = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        const password = e.target.password.value
        const confirmPassword = e.target.confirmPassword.value

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.')
            return
        }

        const result = await onRegister({
            username: e.target.username.value,
            email: e.target.email.value,
            password: password
        })
        if (result.success) {
            setSuccess('Conta criada com sucesso! Faça login.')
            setIsRegisterMode(false)
            setError('')
        } else {
            setError(result.error)
        }
    }

    const handleToggleMode = () => {
        setIsRegisterMode(!isRegisterMode)
        setError('')
        setSuccess('')
    }

    const handleClose = () => {
        setIsRegisterMode(false)
        setError('')
        setSuccess('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 flex justify-between items-center border-b border-zinc-800">
                    <h3 className="text-xl font-bold text-white">{isRegisterMode ? 'Criar conta' : 'Acesse sua conta'}</h3>
                    <button onClick={handleClose} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                {isRegisterMode ? (
                    <form onSubmit={handleSubmitRegister} className="p-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Usuário</label>
                                <input type="text" name="username" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">E-mail</label>
                                <input type="email" name="email" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Senha</label>
                                <input type="password" name="password" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Confirmar Senha</label>
                                <input type="password" name="confirmPassword" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors" />
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                        <button disabled={isLoading} type="submit" className="w-full mt-6 bg-brand hover:bg-brand-hover text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50">
                            {isLoading ? 'Criando conta...' : 'Criar Conta'}
                        </button>

                        <p className="text-center text-zinc-500 text-sm mt-6">
                            Já tem uma conta?{' '}
                            <button type="button" onClick={handleToggleMode} className="text-brand hover:text-brand-hover font-semibold transition-colors">
                                Entrar
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleSubmitLogin} className="p-8">
                        {success && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-4">
                                {success}
                            </div>
                        )}

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

                        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                        <button disabled={isLoading} type="submit" className="w-full mt-6 bg-brand hover:bg-brand-hover text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50">
                            {isLoading ? 'A entrar...' : 'Entrar'}
                        </button>

                        <p className="text-center text-zinc-500 text-sm mt-6">
                            Não tem conta ainda?{' '}
                            <button type="button" onClick={handleToggleMode} className="text-brand hover:text-brand-hover font-semibold transition-colors">
                                Cadastre-se
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}

export function MyTicketsView({ tickets, loading, formatTime, formatDate }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Meus Tickets</h2>
                <p className="text-zinc-400 text-lg">Seus ingressos comprados aparecem aqui.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🎫</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Nenhum ingresso ainda</h3>
                    <p className="text-zinc-500">Quando você comprar um ingresso, ele aparecerá aqui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all">
                            <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
                                <span className="text-brand font-black tracking-widest uppercase text-[10px]">CineReserve</span>
                                <h3 className="text-xl font-bold text-white mt-1 mb-1 leading-tight">{ticket.movie_title}</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Horário</p>
                                        <p className="text-white font-semibold">{formatTime(ticket.session_time)}</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Data</p>
                                        <p className="text-white font-semibold">{formatDate(ticket.session_time)}</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Assento</p>
                                        <p className="text-brand font-black text-2xl">{ticket.seat.seat_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Pedido</p>
                                        <p className="text-white font-mono font-semibold">#{ticket.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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

export function Footer() {
    return (
        <footer className="mt-24 border-t border-zinc-800 bg-zinc-950/80 pt-16 pb-8 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 bg-brand/10 blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Vamos conversar?</h2>
                <p className="text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Estou sempre aberto a novos desafios em desenvolvimento backend, arquitetura de sistemas e parcerias em projetos open-source.
                </p>

                <div className="flex flex-wrap justify-center gap-6 mb-16">
                    <a href="https://www.linkedin.com/in/lucas-daniel-costa-souza/" className="flex items-center gap-2 text-brand hover:text-brand-hover font-semibold transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        LinkedIn
                    </a>
                    <a href="https://github.com/PatoCareca1" className="flex items-center gap-2 text-brand hover:text-brand-hover font-semibold transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        GitHub
                    </a>
                    <a href="mailto:lucasd1234@gmail.com" className="flex items-center gap-2 text-brand hover:text-brand-hover font-semibold transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        contato@lucasdaniel.dev.br
                    </a>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-12">
                    <p className="text-zinc-300 italic text-sm">
                        "Não conseguiu achar o filme que queria? Sinto lhe dizer, mas esse não é realmente um site de um cinema. Mas se achou a arquitetura deste projeto interessante, <a href="http://www.lucasdaniel.dev.br" className="text-brand hover:underline font-bold">visite o meu site</a> e veja o código fonte no GitHub!"
                    </p>
                </div>

                <p className="text-zinc-600 text-xs uppercase tracking-widest font-semibold">
                    © 2026 Lucas Daniel • Desenvolvedor Backend • Natal, RN
                </p>
            </div>
        </footer>
    )
}

export function MovieCard({ movie, onSelect }) {
    const extension = movie.id === 6 ? 'jpg' : 'png';
    const imageUrl = `/poster-${movie.id}.${extension}`;

    return (
        <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-brand/10 flex flex-col">
            <div className="aspect-[2/3] w-full relative overflow-hidden bg-zinc-950 flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <div style={{ display: 'none' }} className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 items-center justify-center p-6 text-center">
                    <h3 className="text-xl font-bold text-zinc-600 uppercase tracking-widest">{movie.title}</h3>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow bg-zinc-900 border-t border-zinc-800">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
                    <span className="bg-zinc-800 px-2 py-1 rounded">{movie.description.split(' - ')[0]}</span>
                    <span>•</span>
                    <span>{movie.duration_minutes} min</span>
                </div>
                <div className="mt-auto">
                    <button onClick={() => onSelect(movie)} className="w-full bg-zinc-800 hover:bg-brand text-white font-semibold py-2.5 rounded-xl transition-colors active:scale-95">
                        Ver Sessões
                    </button>
                </div>
            </div>
        </div>
    )
}