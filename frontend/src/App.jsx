import { useState, useEffect } from 'react'
import { api } from './api'
import { Header, LoginModal, TicketSuccess } from './components'

const MOCK_SESSIONS = [
  { id: 101, time: '15:30', format: 'Dublado', room: 'Sala 1', is_3d: false },
  { id: 102, time: '18:45', format: 'Legendado', room: 'Sala 2', is_3d: true },
  { id: 103, time: '21:15', format: 'Legendado', room: 'Sala 1 VIP', is_3d: false },
]

const MOCK_SEATS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  seat_number: `A${i + 1}`,
  is_purchased: [2, 5, 7, 12].includes(i + 1)
}))

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(null)

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

  const handleCloseModal = () => {
    setSelectedMovie(null)
    setSelectedSession(null)
    setSelectedSeat(null)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    const credentials = {
      username: e.target.username.value,
      password: e.target.password.value
    }

    try {
      const response = await api.login(credentials)
      if (response.ok) {
        const data = await response.json()
        setToken(data.access)
        setIsLoggedIn(true)
        setIsLoginOpen(false)
      } else {
        alert('Credenciais inválidas.')
      }
    } catch (error) {
      alert('Erro ao ligar ao servidor.')
    } finally {
      setActionLoading(false)
    }
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
        alert('Este assento já não está disponível.')
        setActionLoading(false)
        return
      }

      const checkoutRes = await api.checkout(selectedSeat.id, token)
      if (checkoutRes.ok) {
        const checkoutData = await checkoutRes.json()
        setPurchasedTicket({
          movie: selectedMovie.title,
          time: selectedSession.time,
          room: selectedSession.room,
          seat: selectedSeat.seat_number,
          orderId: checkoutData.ticket_id || Math.random().toString(36).substr(2, 9).toUpperCase()
        })
        handleCloseModal()
      } else {
        alert('Erro ao processar o pagamento.')
      }
    } catch (error) {
      alert('Erro de rede ao processar compra.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="min-h-screen font-sans selection:bg-brand selection:text-white pb-20">
      <Header isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginOpen(true)} onLogoClick={() => setPurchasedTicket(null)} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {purchasedTicket ? (
          <TicketSuccess ticket={purchasedTicket} onHomeClick={() => setPurchasedTicket(null)} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {movies.map((movie) => (
                  <div key={movie.id} className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-brand/10 flex flex-col">
                    <div className="aspect-[2/3] w-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center p-6 text-center group-hover:opacity-90 transition-opacity flex-shrink-0">
                      <h3 className="text-2xl font-bold text-zinc-600 uppercase tracking-widest">{movie.title}</h3>
                    </div>
                    <div className="p-5 flex flex-col flex-grow bg-zinc-900">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
                        <span className="bg-zinc-800 px-2 py-1 rounded">{movie.description}</span>
                        <span>•</span>
                        <span>{movie.duration_minutes} min</span>
                      </div>
                      <div className="mt-auto">
                        <button onClick={() => setSelectedMovie(movie)} className="w-full bg-zinc-800 hover:bg-brand text-white font-semibold py-2.5 rounded-xl transition-colors active:scale-95">
                          Ver Sessões
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} isLoading={actionLoading} />

      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">

            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
              <div>
                <div className="flex items-center gap-3">
                  {selectedSession && (
                    <button onClick={() => { setSelectedSession(null); setSelectedSeat(null); }} className="text-zinc-400 hover:text-white mr-2 transition-colors">
                      ← Voltar
                    </button>
                  )}
                  <h3 className="text-2xl font-bold text-white">{selectedMovie.title}</h3>
                </div>
                <p className="text-zinc-400 text-sm mt-1">
                  {!selectedSession ? 'Selecione o horário desejado' : `Sessão das ${selectedSession.time} - Escolha seu assento`}
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 w-10 h-10 rounded-full transition-colors flex items-center justify-center">✕</button>
            </div>

            <div className="p-8 overflow-y-auto bg-zinc-900/50">
              {!selectedSession ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_SESSIONS.map((session) => (
                    <button key={session.id} onClick={() => setSelectedSession(session)} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-brand hover:bg-brand/5 transition-all text-left group">
                      <div>
                        <span className="block text-3xl font-black text-white group-hover:text-brand transition-colors">{session.time}</span>
                        <span className="text-zinc-400 text-sm mt-1 block">{session.room}</span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded font-medium">{session.format}</span>
                        {session.is_3d && <span className="bg-brand/20 text-brand text-xs px-2 py-1 rounded font-bold border border-brand/20">3D</span>}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="w-full h-12 bg-gradient-to-b from-white/10 to-transparent rounded-t-[50%] mb-12 border-t-4 border-white/20 flex items-start justify-center pt-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tela</span>
                  </div>

                  <div className="flex justify-center mb-10">
                    <div className="grid grid-cols-5 gap-3 md:gap-5">
                      {MOCK_SEATS.map((seat) => (
                        <button
                          key={seat.id}
                          disabled={seat.is_purchased}
                          onClick={() => setSelectedSeat(seat)}
                          className={`relative w-12 h-14 md:w-14 md:h-16 rounded-t-2xl rounded-b-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${seat.is_purchased ? 'bg-zinc-950 text-zinc-800 shadow-inner cursor-not-allowed' : selectedSeat?.id === seat.id ? 'bg-brand text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] -translate-y-2' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white hover:-translate-y-1'}`}
                        >
                          {seat.seat_number}
                          {seat.is_purchased && <div className="absolute inset-0 flex items-center justify-center"><span className="text-zinc-800 text-2xl rotate-45">+</span></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 text-sm bg-zinc-950/50 py-3 rounded-xl border border-zinc-800 max-w-md mx-auto">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-zinc-800"></div><span className="text-zinc-400">Livre</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-brand shadow-[0_0_10px_rgba(225,29,72,0.4)]"></div><span className="text-zinc-400">Selecionado</span></div>
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