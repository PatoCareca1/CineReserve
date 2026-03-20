const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = {
    getMovies: async () => {
        const res = await fetch(`${API_URL}/movies/`)
        if (!res.ok) throw new Error('Network error')
        return res.json()
    },
    getSessions: async (movieId) => {
        const res = await fetch(`${API_URL}/movies/${movieId}/sessions/`)
        if (!res.ok) throw new Error('Network error')
        return res.json()
    },
    getSeats: async (sessionId) => {
        const res = await fetch(`${API_URL}/movies/sessions/${sessionId}/seats/`)
        if (!res.ok) throw new Error('Network error')
        return res.json()
    },
    login: async (credentials) => {
        const res = await fetch(`${API_URL}/users/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
        return res
    },
    reserve: async (seatId, token) => {
        const res = await fetch(`${API_URL}/tickets/reserve/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ seat_id: seatId })
        })
        return res
    },
    checkout: async (seatId, token) => {
        const res = await fetch(`${API_URL}/tickets/checkout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ seat_id: seatId })
        })
        return res
    }
}