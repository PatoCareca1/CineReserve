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

## 🗄️ Database Design & Concurrency Strategy

To ensure robust concurrency control and fulfill the strict requirements for seat locking (Case 4 and 5), we opted for an explicit relational mapping for sessions and seats:

* **`Movie`:** Contains catalog details (title, description, duration).
* **`Session`:** Represents a specific screening (datetime) linked to a Movie.
* **`Seat`:** Instead of calculating seats on the fly, every single seat for a session is explicitly mapped in the database with a unique identifier (e.g., 'A1', 'A2') and a permanent `is_purchased` boolean state.
* **State Management:** The "Available" and "Purchased" states are the source of truth in PostgreSQL. The "Reserved" (locked) state is dynamically handled in-memory using Redis with a 10-minute TTL, ensuring extreme performance and zero database deadlocks during high-traffic checkout flows.

```mermaid
erDiagram
    %% =========================
    %% RELATIONSHIPS
    %% =========================
    USER ||--o{ TICKET : purchases
    MOVIE ||--o{ SESSION : has
    SESSION ||--o{ SEAT : contains
    SEAT ||--o| TICKET : locked

    %% =========================
    %% ENTITIES
    %% =========================

    USER {
        int id PK
        string username "unique"
    }

    MOVIE {
        int id PK
        string title
        int duration_minutes "min"
    }

    SESSION {
        int id PK
        datetime start_datetime
        int movie_id FK
    }

    SEAT {
        int id PK
        string seat_number "e.g. A10"
        boolean is_purchased
        int session_id FK
    }

    TICKET {
        int id PK
        datetime created_at
        int user_id FK
        int seat_id FK "unique"
    }

```

## 🛠️ Quickstart (How to Run)

To make the evaluation process as smooth as possible, I have implemented a `Makefile` that abstracts the complex Docker commands. **However, this is completely optional.** If you prefer to use the standard Docker commands, the original equivalent is provided right below each step.

*(Note: If using Make, remember to always prefix the command with `make`, e.g., `make up`)*

### Prerequisites

* Docker & Docker Compose

### Step-by-Step

**1. Start the infrastructure** (Database, Redis, Celery, and the Web API):

* Using Make:

  ```bash
  make up
  ```

* Using Standard Docker:

  ```bash
  docker-compose up -d
  ```

**2. Apply migrations:**

* Using Make:

  ```bash
  make migrate
  ```

* Using Standard Docker:

  ```bash
  docker-compose exec web python manage.py migrate
  ```

**3. Populate the database with test data** (Creates a Movie, a Session, and 10 Seats):

* Using Make:

  ```bash
  make seed
  ```

* Using Standard Docker:

  ```bash
  docker-compose exec web python manage.py shell -c "from movies.models import Movie, Session, Seat; from django.utils import timezone; m, _ = Movie.objects.get_or_create(title='Matrix Resurrections', defaults={'description':'Sci-Fi', 'duration_minutes':148}); s, _ = Session.objects.get_or_create(movie=m, start_datetime=timezone.now()); [Seat.objects.get_or_create(session=s, seat_number=f'A{i}') for i in range(1, 11)]"
  ```

**4. Run the automated test suite** (Validates concurrency, cache, and business logic):

* Using Make:

  ```bash
  make test
  ```

* Using Standard Docker:

  ```bash
  docker-compose exec web python manage.py test
  ```

## 📖 API Documentation

Once the application is running, the interactive Swagger documentation is available at:
👉 **[http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)**

## Feature Implementation Checklist

### Core Requirements

[X] [TC.1] API Development: RESTful API using Python + Poetry + Django REST Framework.

[X] [TC.2] Authentication: JWT-based user authentication & secure session management.

[X] [TC.3.1] Database: PostgreSQL with optimized normalized design.

[X] [TC.3.2] Caching & Scalability: - [X] Redis distributed lock for 10-minute temporary seat reservations.

[X] Redis caching for popular sessions and movies.

[X] [TC.4] Pagination: Applied to Movies, Sessions, and User Tickets endpoints.

[X] [TC.5] Testing: Comprehensive Unit testing covering functional and edge cases.

[X] [TC.6] Documentation: OpenAPI/Swagger detailed endpoints.

[X] [TC.7] Docker: Dockerfile and docker-compose.yml configured.

### Use Cases Flow

[x] Case 1: Registration and Login.

[X] Case 2: List all available movies.

[X] Case 3: List all available sessions for a specific movie.

[X] Case 4: Seat Map Visualization (Distinguish: Available, Reserved, Purchased).

[X] Case 5: Reservation & Locking (10-minute Redis lock).

[X] Case 6: Checkout & Ticket Generation (Free tickets, lock transitions to permanent DB record).

[X] Case 7: "My Tickets" Portal (List user's active/past tickets).

### Advanced

[X] Security: Rate limiting, input validation, SQLi & CSRF prevention.

[X] Asynchronous Tasks: Celery for background processing (auto-releasing locks).

[X] CI/CD: GitHub Actions pipeline to run tests on every push/PR.
