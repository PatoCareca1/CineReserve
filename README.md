# CineReserve API 🍿

CineReserve is a high-performance, scalable RESTful backend built for modern cinema operations (specifically tailored for "Cinépolis Natal"). It handles user authentication, movie cataloging, real-time seat availability, and a robust ticket reservation flow using distributed locks.

## 🏗 Architecture & Tech Stack

* **Language:** Python 3.12+
* **Framework:** Django & Django REST Framework (DRF)
* **Database:** PostgreSQL (Relational data, Transactions, ACID compliance)
* **Cache & Lock Manager:** Redis (Distributed locking for seat reservations, caching high-read endpoints)
* **Task Queue:** Celery (Background tasks, lock expiration, emails)
* **Dependency Management:** Poetry
* **Containerization:** Docker & Docker Compose
* **CI/CD:** GitHub Actions
* **Documentation:** Swagger (via drf-spectacular)

## 🚀 How to Run (Local Environment)

1. Clone the repository:

   ```bash
   git clone [https://github.com/PatoCareca1/cinereserve.git](https://github.com/PatoCareca1/cinereserve.git)
   cd cinereserve

# Start the infrastructure (PostgreSQL, Redis, Application, Celery Worker) using Docker

docker-compose up --build

# Access the API Documentation

Swagger UI: <http://localhost:8000/api/schema/swagger-ui/>

## Feature Implementation Checklist

# Core Requirements

[ ] [TC.1] API Development: RESTful API using Python + Poetry + Django REST Framework.

[ ] [TC.2] Authentication: JWT-based user authentication & secure session management.

[ ] [TC.3.1] Database: PostgreSQL with optimized normalized design.

[ ] [TC.3.2] Caching & Scalability: - [ ] Redis distributed lock for 10-minute temporary seat reservations.

[ ] Redis caching for popular sessions and movies.

[ ] [TC.4] Pagination: Applied to Movies, Sessions, and User Tickets endpoints.

[ ] [TC.5] Testing: Comprehensive Unit testing covering functional and edge cases.

[ ] [TC.6] Documentation: OpenAPI/Swagger detailed endpoints.

[ ] [TC.7] Docker: Dockerfile and docker-compose.yml configured.

# Use Cases Flow

[ ] Case 1: Registration and Login.

[ ] Case 2: List all available movies.

[ ] Case 3: List all available sessions for a specific movie.

[ ] Case 4: Seat Map Visualization (Distinguish: Available, Reserved, Purchased).

[ ] Case 5: Reservation & Locking (10-minute Redis lock).

[ ] Case 6: Checkout & Ticket Generation (Free tickets, lock transitions to permanent DB record).

[ ] Case 7: "My Tickets" Portal (List user's active/past tickets).

Advanced / Bonus (Treated as Core)
[ ] Security: Rate limiting, input validation, SQLi & CSRF prevention.

[ ] Asynchronous Tasks: Celery for background processing (auto-releasing locks).

[ ] CI/CD: GitHub Actions pipeline to run tests on every push/PR.
