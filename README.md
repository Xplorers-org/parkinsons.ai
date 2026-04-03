# NeuroTrack AI

NeuroTrack AI is a multimodal Parkinson’s severity screening platform built with Next.js.
It supports:

- Patient registration/session management
- Voice analysis
- Drawing analysis (spiral/wave)
- Gait analysis (video)
- Unified results and progression tracking

---

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: Tailwind CSS + shadcn/ui + Radix UI
- Charts: Recharts
- Backend (BFF): Next.js API routes
- Database: Supabase (Postgres)
- Notifications: Sonner
- Icons: Lucide

---

## Main User Flow

1. **Patient Info** (`/analysis`)
   - Register new patient or find existing patient
   - Creates or resumes a test session

2. **Voice Analysis** (`/analysis/voice`)
3. **Drawing Analysis** (`/analysis/drawing`)
4. **Gait Analysis** (`/analysis/gait`)
5. **Results** (`/analysis/results`)
6. **Progress Over Time** (`/analysis/progress`)

Session and patient details are stored in `sessionStorage` on the client and persisted to Supabase via API routes.

---

## Project Structure (high level)

```text
app/
	page.tsx                          # Landing page
	layout.tsx                        # Root layout, metadata, theme, toaster
	analysis/
		page.tsx                        # Patient info + register/find
		voice/page.tsx                  # Voice analysis flow
		drawing/page.tsx                # Drawing analysis flow
		gait/page.tsx                   # Gait analysis flow
		results/page.tsx                # Combined result summary
		progress/page.tsx               # Patient-id search + trend chart + history table
	api/
		patients/register/route.ts      # Create patient + initial session
		patients/session/route.ts       # Create session for existing patient
		patients/[patient_id]/history/route.ts
		analyze/voice/route.ts          # Forwards to Voice ML API + stores result
		analyze/drawing/route.ts        # Forwards to Drawing ML API + stores result
		analyze/gait/route.ts           # Forwards to Gait ML API + stores result
		debug/*                         # Debug endpoints

lib/
	supabase.ts                       # Supabase client (service role)
	db.ts                             # DB operations and history normalization

components/
	analysis/*                        # Analysis UI building blocks
	ui/*                              # Reusable shadcn/ui components
```

---

## Environment Variables

Create `.env.local` with:

```bash
# Supabase
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# External ML services
VOICE_API_URL=http://<voice-api-host>
MIS_API_URL=http://<drawing-api-host>
GAIT_API_URL=http://<gait-api-host>
```

---

## Database Schema (expected)

The app expects these core tables in Supabase:

1. `patients`
   - `id` (uuid, pk)
   - `patient_id` (text, unique, human readable)
   - `full_name` (text)
   - `gender` (text)
   - `age` (int)

2. `test_sessions`
   - `id` (uuid, pk)
   - `patient_id` (uuid, fk -> patients.id)
   - `test_time` (timestamp)
   - `status` (text)

3. `voice_results`
   - `id`, `session_id`
   - `age`, `sex`, `test_count`, `prediction`, `processing_time_ms`

4. `drawing_results`
   - `id`, `session_id`
   - `drawing_type`, `motor_impairment_score`, `severity_level`, `description`
   - `raw_logit`, `sigmoid_probability`, `is_parkinson`, `processing_time_ms`

5. `gait_results`
   - `id`, `session_id`
   - `gait_score`, `processing_time_ms`

---

## API Contracts (summary)

### Patient APIs

- `POST /api/patients/register`
  - Body: `{ patient_id, full_name, gender, age, test_time }`
  - Creates patient + session

- `POST /api/patients/session`
  - Body: `{ patient_id, test_time }`
  - Creates session for existing patient

- `GET /api/patients/[patient_id]/history`
  - Returns normalized merged analysis history

### Analysis APIs

- `POST /api/analyze/voice`
  - FormData: `session_id`, `patient_id`, `age`, `sex`, `audio_file`
  - Forwards to `${VOICE_API_URL}/analyze/voice`

- `POST /api/analyze/drawing`
  - FormData: `session_id`, `drawing_type`, `file`
  - Forwards to `${MIS_API_URL}/predict/spiral` or `/predict/wave`

- `POST /api/analyze/gait`
  - FormData: `session_id`, `gender`, `video`
  - Forwards to `${GAIT_API_URL}/analyze`

---

## Local Development

Install dependencies:

```bash
pnpm install
```

Run dev server:

```bash
pnpm dev
```

Build production:

```bash
pnpm build
pnpm start
```

Lint:

```bash
pnpm lint
```

---

## Debug Endpoints

- `GET /api/debug/all-data`
- `GET /api/debug/patient/:patient_id`

Useful for quick DB verification in development.

---

## Important Implementation Notes

1. **Build config**
   - `next.config.mjs` currently has:
   - `typescript.ignoreBuildErrors = true`
   - This allows builds to pass even with TypeScript errors. Recommended to disable for stricter CI.

2. **Image config**
   - `images.unoptimized = true` is enabled.

3. **Supabase key safety**
   - Keep service role key in server environment only.

4. **History normalization**
   - Multiple result table shapes are normalized in `lib/db.ts` and pages for unified display.

---

## Screens / Routes

- `/` – marketing landing page
- `/analysis` – patient registration/session
- `/analysis/voice` – voice pipeline
- `/analysis/drawing` – drawing pipeline
- `/analysis/gait` – gait pipeline
- `/analysis/results` – summary cards and latest status
- `/analysis/progress` – patient lookup + longitudinal chart + analysis history table

---

## Deployment

Deploy on Vercel or any Node-compatible host.

Production URL:

- https://neurotrack-ai.vercel.app/

Required on hosting platform:

- All environment variables listed above
- Supabase schema and permissions configured
- ML API services reachable from deployment environment
