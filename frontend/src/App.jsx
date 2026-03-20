import { useState, useEffect } from 'react'
import { api } from './api'
import { Header, LoginModal, TicketSuccess, Footer, MovieCard, MyTicketsView } from './components'

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)

  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [seats, setSeats] = useState([])
  const [seatsLoading, setSeatsLoading] = useState(false)

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState('')

  const [showMyTickets, setShowMyTickets] = useState(false)
  const [myTickets, setMyTickets] = useState([])
  const [ticketsLoading, setTicketsLoading] = useState(false)

  const [purchasedTicket, setPurchasedTicket] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    api.getMovies()
      .then(data => {
        setMovies(data.results || data)
        setLoading(false)
      })
      .catch(() => {
        setMovies([
          { id: 1, title: "Matrix Resurrections", description: "Sci-Fi", duration_minutes: 148 },
          { id: 2, title: "Dune: Part Two", description: "Epic Sci-Fi", duration_minutes: 166 }
        ])
        setLoading(false)
      })
  }, [])

  const handleSelectMovie = async (movie) => {
    setSelectedMovie(movie)
    setSelectedSession(null)
    setSelectedSeat(null)
    setSessions([])
    setSessionsLoading(true)
    try {
      const data = await api.getSessions(movie.id)
      setSessions(data.results || data)
    } catch {
      setSessions([])
    } finally {
      setSessionsLoading(false)
    }
  }

  const handleSelectSession = async (session) => {
    setSelectedSession(session)
    setSelectedSeat(null)
    setSeats([])
    setSeatsLoading(true)
    try {
      const data = await api.getSeats(session.id)
      setSeats(Array.isArray(data) ? data : data.results || [])
    } catch {
      setSeats([])
    } finally {
      setSeatsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setSelectedMovie(null)
    setSelectedSession(null)
    setSelectedSeat(null)
    setSessions([])
    setSeats([])
  }

  const handleLogin = async (credentials) => {
    setActionLoading(true)
    try {
      const response = await api.login(credentials)
      if (response.ok) {
        const data = await response.json()
        setToken(data.access)
        setIsLoggedIn(true)
        setUsername(credentials.username)
        setIsLoginOpen(false)
        return { success: true }
      } else {
        return { success: false, error: 'Credenciais inválidas.' }
      }
    } catch {
      return { success: false, error: 'Erro ao ligar ao servidor.' }
    } finally {
      setActionLoading(false)
    }
  }

  const handleRegister = async (data) => {
    setActionLoading(true)
    try {
      const response = await api.register(data)
      if (response.ok) {
        return { success: true }
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg = Object.values(errorData).flat().join(' ') || 'Erro ao criar conta.'
        return { success: false, error: errorMsg }
      }
    } catch {
      return { success: false, error: 'Erro ao ligar ao servidor.' }
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setIsLoggedIn(false)
    setUsername('')
    setShowMyTickets(false)
    setMyTickets([])
    setPurchasedTicket(null)
  }

  const handleShowMyTickets = async () => {
    setShowMyTickets(true)
    setPurchasedTicket(null)
    setTicketsLoading(true)
    try {
      const data = await api.getMyTickets(token)
      setMyTickets(data.results || data)
    } catch {
      setMyTickets([])
    } finally {
      setTicketsLoading(false)
    }
  }

  const formatTime = (datetimeStr) => {
    const date = new Date(datetimeStr)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (datetimeStr) => {
    const date = new Date(datetimeStr)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const handleCheckout = async () => {
    if (!selectedSeat || !selectedSession) return
    if (!isLoggedIn || !token) {
      alert('Por favor, faz login primeiro!')
      setIsLoginOpen(true)
      return
    }

    setActionLoading(true)

    try {
      const reserveRes = await api.reserve(selectedSeat.id, token)
      if (!reserveRes.ok) {
        const errorData = await reserveRes.json().catch(() => ({}))
        alert(errorData.detail || 'Este assento já não está disponível.')
        setActionLoading(false)
        return
      }

      const checkoutRes = await api.checkout(selectedSeat.id, token)
      if (checkoutRes.ok) {
        const checkoutData = await checkoutRes.json()
        setPurchasedTicket({
          movie: selectedMovie.title,
          time: formatTime(selectedSession.start_datetime),
          seat: selectedSeat.seat_number,
          orderId: checkoutData.ticket_id || Math.random().toString(36).substr(2, 9).toUpperCase()
        })
        handleCloseModal()
      } else {
        alert('Erro ao processar o pagamento.')
      }
    } catch {
      alert('Erro de rede ao processar compra.')
    } finally {
      setActionLoading(false)
    }
  }

  const getSeatStyle = (seat) => {
    const isUnavailable = seat.status === 'Purchased' || seat.status === 'Reserved'
    const isSelected = selectedSeat?.id === seat.id

    if (isUnavailable) return 'bg-zinc-950 text-zinc-800 shadow-inner cursor-not-allowed'
    if (isSelected) return 'bg-brand text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] -translate-y-2'
    return 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white hover:-translate-y-1'
  }

  const handleGoHome = () => {
    setShowMyTickets(false)
    setPurchasedTicket(null)
  }

  return (
    <div className="min-h-screen font-sans selection:bg-brand selection:text-white pb-20">
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoClick={handleGoHome}
        onMyTicketsClick={handleShowMyTickets}
        onLogoutClick={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow">
        {purchasedTicket ? (
          <TicketSuccess ticket={purchasedTicket} onHomeClick={handleGoHome} />
        ) : showMyTickets ? (
          <MyTicketsView tickets={myTickets} loading={ticketsLoading} formatTime={formatTime} formatDate={formatDate} />
        ) : (
          <>
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Em Cartaz</h2>
              <p className="text-zinc-400 text-lg">Garanta seu lugar nas maiores estreias da semana.</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onSelect={handleSelectMovie} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {!purchasedTicket && !selectedMovie && !showMyTickets && <Footer />}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={actionLoading}
      />

      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">

            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
              <div>
                <div className="flex items-center gap-3">
                  {selectedSession && (
                    <button onClick={() => { setSelectedSession(null); setSelectedSeat(null); setSeats([]); }} className="text-zinc-400 hover:text-white mr-2 transition-colors">
                      ← Voltar
                    </button>
                  )}
                  <h3 className="text-2xl font-bold text-white">{selectedMovie.title}</h3>
                </div>
                <p className="text-zinc-400 text-sm mt-1">
                  {!selectedSession ? 'Selecione o horário desejado' : `Sessão das ${formatTime(selectedSession.start_datetime)} - Escolha seu assento`}
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 w-10 h-10 rounded-full transition-colors flex items-center justify-center">✕</button>
            </div>

            <div className="p-8 overflow-y-auto bg-zinc-900/50">
              {!selectedSession ? (
                sessionsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand"></div>
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="text-center text-zinc-500 py-12">Nenhuma sessão disponível para este filme.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessions.map((session) => (
                      <button key={session.id} onClick={() => handleSelectSession(session)} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-brand hover:bg-brand/5 transition-all text-left group">
                        <div>
                          <span className="block text-3xl font-black text-white group-hover:text-brand transition-colors">{formatTime(session.start_datetime)}</span>
                          <span className="text-zinc-400 text-sm mt-1 block">{formatDate(session.start_datetime)}</span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded font-medium">{session.movie_title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="w-full h-12 bg-gradient-to-b from-white/10 to-transparent rounded-t-[50%] mb-12 border-t-4 border-white/20 flex items-start justify-center pt-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tela</span>
                  </div>

                  {seatsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand"></div>
                    </div>
                  ) : (
                    <div className="flex justify-center mb-10">
                      <div className="grid grid-cols-5 gap-3 md:gap-5">
                        {seats.map((seat) => (
                          <button
                            key={seat.id}
                            disabled={seat.status === 'Purchased' || seat.status === 'Reserved'}
                            onClick={() => setSelectedSeat(seat)}
                            className={`relative w-12 h-14 md:w-14 md:h-16 rounded-t-2xl rounded-b-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${getSeatStyle(seat)}`}
                          >
                            {seat.seat_number}
                            {seat.status === 'Purchased' && <div className="absolute inset-0 flex items-center justify-center"><span className="text-zinc-800 text-2xl rotate-45">+</span></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-6 text-sm bg-zinc-950/50 py-3 rounded-xl border border-zinc-800 max-w-md mx-auto">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-zinc-800"></div><span className="text-zinc-400">Livre</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-brand shadow-[0_0_10px_rgba(225,29,72,0.4)]"></div><span className="text-zinc-400">Selecionado</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-500/30 border border-yellow-500/50"></div><span className="text-zinc-400">Reservado</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center"><span className="text-[10px] text-zinc-800 rotate-45">+</span></div><span className="text-zinc-400">Ocupado</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 flex justify-between items-center">
              <div>
                <p className="text-zinc-400 text-sm">Resumo da Compra</p>
                <p className="text-2xl font-bold text-white">{selectedSeat ? 'R$ 45,00' : 'R$ 0,00'}</p>
              </div>
              <button disabled={!selectedSeat || actionLoading} onClick={handleCheckout} className={`px-8 py-3.5 rounded-xl font-bold transition-all ${selectedSeat ? 'bg-brand hover:bg-brand-hover text-white active:scale-95 shadow-lg shadow-brand/20' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}>
                {actionLoading ? 'A processar...' : 'Comprar Ingresso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App