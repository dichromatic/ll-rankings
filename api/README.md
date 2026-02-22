# LL-Rankings API

This directory contains the backend code for the LL-Rankings application. It is built using **FastAPI** and **PostgreSQL**.

## Project Structure

```text
api/
├── app/
│   ├── api/v1/             # API Route Handlers
│   │   ├── analysis.py     # Endpoints for statistical results (Divergence, Spice, etc.)
│   │   ├── health.py       # Simple health check endpoint for monitoring uptime
│   │   └── submissions.py  # Endpoints for submitting/deleting user rankings
│   │
│   ├── jobs/               # Background Tasks
│   │   └── analysis_scheduler.py # Manages the periodic re-calculation of all statistics (runs every X hours)
│   │
│   ├── seeds/              # Initial Data Loading
│   │   ├── *.json          # Raw song data files (e.g., liella_songs.json, aqours_songs.json)
│   │   ├── subgroups.toml  # Configuration file defining subgroups (e.g., "BiBi", "CyaRon!", "CatChu!")
│   │   └── init.py         # The DatabaseSeeder class that loads JSON/TOML data into the DB
│   │
│   ├── services/           # Business Logic & Algorithms
│   │   ├── analysis.py     # Core statistical engine (Divergence Matrix, Hot Takes, Spice Meter logic)
│   │   ├── matching.py     # Fuzzy/Strict string matching to map user text -> Song IDs
│   │   ├── ranking_utils.py# Mathematical helpers for relative ranking calculations
│   │   ├── tie_handling.py # Logic for resolving tied ranks (e.g., "1. Song A = Song B")
│   │   └── missing_handling.py # Logic for handling missing songs in submissions (append, retry, etc.)
│   │
│   ├── utils/              # General Utilities
│   │   └── validators.py   # Input validation helpers
│   │
│   ├── config.py           # Environment variable management (Database URL, API Keys)
│   ├── database.py         # SQLAlchemy session factory and database connection logic
│   ├── main.py             # Application entry point, lifespan events, and exception handlers
│   ├── models.py           # SQLAlchemy Database Models (Schema definitions)
│   ├── schemas.py          # Pydantic Schemas for Request/Response validation
│   ├── exceptions.py       # Custom exception classes (LiellaException, etc.)
│   └── logging_config.py   # Configuration for application logging format and levels
│
├── tests/                  # Test Suite
│   ├── test_database.py    # Unit tests for database models
│   ├── test_submissions.py # Integration tests for submission endpoints
│   └── test.sh             # Shell script to run the full test suite
│
├── tool.py                 # CLI Utility for database management (Backup/Wipe/Restore)
├── Dockerfile              # Docker instructions for building the API image
├── docker-compose.yml      # Orchestration for running the API and Database locally
└── requirements.txt        # Python dependencies list
```

## Database Schema

The database uses PostgreSQL with SQLAlchemy ORM. The key models are:

### `Franchise`
- **id**: UUID (PK)
- **name**: String (Unique) - e.g., "liella", "aqours"
- **created_at**: Timestamp

### `Song`
- **id**: UUID (PK)
- **name**: String
- **franchise_id**: UUID (FK -> Franchise)
- **youtube_url**: String (Optional)
- **Unique Constraint**: (name, franchise_id)

### `Subgroup`
- **id**: UUID (PK)
- **name**: String - e.g., "All Songs", "CatChu!"
- **franchise_id**: UUID (FK -> Franchise)
- **song_ids**: JSON List of UUIDs - Defines which songs belong to this group
- **is_subunit**: Boolean - Marks official subunits
- **is_custom**: Boolean - Marks custom/fan-made groupings

### `Submission`
- **id**: UUID (PK)
- **username**: String
- **franchise_id**: UUID (FK -> Franchise)
- **subgroup_id**: UUID (FK -> Subgroup)
- **raw_ranking_text**: String - The original text submitted by the user
- **parsed_rankings**: JSON - Map of `{song_id: rank_float}`
- **submission_status**: Enum (PENDING, VALID, INCOMPLETE, CONFLICTED, FAILED)
- **conflict_report**: JSON - Details on parsing errors if any

### `AnalysisResult`
- **id**: UUID (PK)
- **franchise_id**: UUID (FK -> Franchise)
- **subgroup_id**: UUID (FK -> Subgroup)
- **analysis_type**: String - "DIVERGENCE", "SPICE", etc.
- **result_data**: JSON - The computed statistical payload
- **based_on_submissions**: Integer - Count of submissions used in calculation

## Seeding Process

The database is automatically seeded on application startup (`main.py`) to ensure metadata is consistent.

1. **Franchise Creation**:
   - The system iterates through a hardcoded list of franchises (Liella, Aqours, u's, etc.) and ensures they exist in the `franchises` table.

2. **Song Loading**:
   - For each franchise, it looks for a corresponding JSON file in `app/seeds/` (e.g., `liella_songs.json`).
   - If the `songs` table for that franchise is empty, it loads the songs from the JSON file.
   - **Note**: This only happens if the table is empty. To update song data, the table must be cleared first.

3. **Subgroup Synchronization**:
   - Runs **every** startup.
   - Reads `app/seeds/subgroups.toml`.
   - Maps song names defined in TOML to their Database UUIDs.
   - Upserts records in the `subgroups` table.
   - This allows you to add or modify subgroups (like new units or albums) simply by editing the TOML file and restarting the container.

## Key Concepts

### 1. The Ranking Model
The core entity is a **Submission**, which represents a user's ordered list of songs for a specific **Franchise** and **Subgroup**.
- **Raw Input:** Users submit a plain text list.
- **Parsing:** `services/matching.py` parses this text, resolving line items to database `Song` IDs.
- **Storage:** Rankings are stored as JSON mappings of `{song_id: rank_value}`.

### 2. Analysis Engine (`services/analysis.py`)
The backend calculates advanced statistics based on the aggregate of user submissions:
- **Divergence:** How different two users' tastes are (Root Mean Square difference).
- **Controversy:** Which songs have the highest variance in ranking (loved by some, hated by others).
- **Hot Takes:** Individual user rankings that deviate significantly from the community average.
- **Spice Meter:** A "hipster score" measuring how much a user's taste diverges from the consensus.

## Management Tool (`tool.py`)

A helper script is provided to manage the database state, useful for development and migrations.

```bash
# Backup valid rankings to a JSON file
python tool.py backup

# Wipe the database and re-seed metadata (Franchises/Songs)
# WARNING: Deletes all user data!
python tool.py wipe

# Restore rankings from the backup file
python tool.py restore
```

## Development

### Prerequisites
- Docker & Docker Compose
- Python 3.10+

### Running Locally
```bash
# Start API and Database
docker-compose up --build

# The API will be available at http://localhost:8000
# Swagger UI: http://localhost:8000/docs
```

### Running Tests
```bash
# Run the test script
./tests/test.sh
```
