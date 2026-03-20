# CineReserve Web Interface 🍿

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

A modern, responsive, and dynamic user interface built for the **CineReserve API**. It handles movie catalog browsing, real-time seat selection, user authentication, and ticket management.

> *"The cinema project concept was incredibly interesting to me. Sometimes I get carried away when a project catches my attention. Although only the backend was requested for this evaluation, I decided to take it a step further and build this interface. I'm not sure if it will be considered in the evaluation, but even if it isn't, I hope you enjoy it!"* — Lucas Daniel

## 🚀 Live Demo

You don't need to run anything locally to test it. The fully functional application is deployed here:

👉 **[Launch CineReserve Web Demo](https://cinereserve.lucasdaniel.dev.br/)**

*Tip: The backend Swagger documentation is also live at [https://cinereserve-api-j1z2.onrender.com/api/docs/](https://cinereserve-api-j1z2.onrender.com/api/docs/)*

---

## 🛠️ Features Implemented

* **Dynamic Movie Catalog:** Fetches and displays available movies from the API.
* **Session Selection:** Shows real session times and formats for each movie.
* **Interactive Seat Map:** Visualizes seat availability reflecting real-time backend state (`Available`, `Reserved`, `Purchased`).
* **Authentication Flow:** Registration and login modals with JWT token management.
* **Ticket Checkout Flow:** End-to-end reservation process with visual feedback for success and errors.
* **My Tickets Portal:** A dedicated page to view all past and active ticket purchases.

## 💻 How to Run Locally

If you prefer to run the frontend locally (pointing to either the local or remote API), follow these steps:

### Prerequisites
* Node.js (v18+)
* npm or yarn
* The backend API running (see the [Backend README](../README.md))

### Installation & Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   By default, the app points to `http://localhost:8000/api`. If you want to point it to the production API (or a different local port), create a `.env` file in the `frontend` root:
   ```env
   VITE_API_URL=https://cinereserve-api-j1z2.onrender.com/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in your browser:**
   Navigate to `http://localhost:5173/`

## 🎨 Design Decisions

* **Vanilla CSS / Tailwind:** Used Tailwind CSS for rapid prototyping while keeping a custom, highly polished "dark mode" cinematic aesthetic.
* **Component-Based:** Organized into reusable React components (`Header`, `MovieCard`, `LoginModal`, `TicketSuccess`, `MyTicketsView`).
* **Resilience:** Built to handle API loading states gracefully, providing visual spinners and empty states to the user.
