# Camp Safety

Camp Safety is a full-stack web application that helps summer camp administrators identify potential gaps in their emergency preparedness practices. Users complete a structured safety assessment, receive a deterministic risk score based on their responses, and get AI-generated recommendations for addressing identified safety gaps.

**Live Demo:** https://camp-safety-assessment.vercel.app/

## Features

- Interactive safety-readiness assessment
- Deterministic rule-based risk scoring
- Identification of specific safety gaps
- AI-generated recommended actions based on assessment results
- Persistent storage of assessments and responses
- Retry button for handling temporary AI service failures
- Responsive interface for desktop, tablet, and mobile
- Ability to restart and complete multiple assessments

## How It Works

Camp Safety separates risk assessment from AI-generated guidance.

1. A user completes a structured safety questionnaire.
2. A deterministic TypeScript risk engine evaluates the responses.
3. The application calculates a risk score and identifies specific safety gaps.
4. Assessment results and individual responses are stored in Supabase.
5. Identified gaps are sent to a Supabase Edge Function.
6. The Edge Function securely calls the Gemini API.
7. Gemini generates practical recommended actions for the identified gaps.
8. The recommendations are returned to the React frontend and displayed alongside the assessment results.

The AI does **not** calculate the risk score or determine whether a camp is safe or unsafe. Scoring and gap identification remain deterministic so that the same assessment responses produce consistent results.

## Architecture

```text
                    Camp Safety
                         |
                         v
              React + TypeScript UI
                         |
             +-----------+-----------+
             |                       |
             v                       v
       Risk Engine              Supabase
       (TypeScript)                 |
             |              +-------+-------+
             |              |               |
             v              v               v
       Risk Score      assessments      responses
       Safety Gaps
             |
             v
      Supabase Edge Function
             |
             v
         Gemini API
             |
             v
   Recommended Safety Actions
             |
             v
        Results Page
```

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Markdown

### Backend and Database

- Supabase
- PostgreSQL
- Supabase Edge Functions
- Deno

### AI

- Google Gemini API

### Deployment

- Vercel

## Risk Assessment

The application's risk engine uses predefined rules to evaluate assessment responses.

Each identified issue contributes a predetermined number of risk points. The engine returns:

- a total risk score
- the safety gaps that contributed to the score
- the number of points associated with each gap

This logic is intentionally separate from the generative AI layer.

For example:

```text
Assessment Responses
        |
        v
Deterministic Risk Engine
        |
        +----> Risk Score
        |
        +----> Identified Safety Gaps
                         |
                         v
                    Gemini API
                         |
                         v
                 Recommended Actions
```

This architecture allows generative AI to provide contextual guidance without allowing it to modify the application's underlying risk calculation.

## Database Design

Camp Safety stores completed assessments in two related tables.

### `assessments`

Stores information about each completed assessment, including:

- assessment ID
- calculated risk score

### `responses`

Stores the individual answers associated with an assessment, including:

- assessment ID
- question ID
- answer

Each response references its parent assessment through `assessment_id`.

```text
assessments
    |
    | 1
    |
    |----< responses
             many
```

## AI Recommendation Pipeline

The Gemini API key is never exposed to the browser.

Instead, the frontend invokes a Supabase Edge Function:

```text
Browser
   |
   | score + identified gaps
   v
Supabase Edge Function
   |
   | secure server-side request
   v
Gemini API
   |
   | recommendations
   v
Edge Function
   |
   v
Browser
```

The Edge Function instructs the model not to:

- recalculate the risk score
- determine whether the camp is safe or unsafe
- make legal or regulatory compliance determinations

The model is instead used to generate concise, practical actions corresponding to gaps already identified by the deterministic system.

## Reliability

The application handles temporary AI-service failures independently from assessment scoring.

If recommendation generation fails:

- the calculated assessment results remain available
- the user receives an error state rather than losing their assessment
- the recommendation request can be retried without repeating or resaving the assessment

Database failures also do not prevent the locally calculated assessment result from being displayed.

## Local Development

Clone the repository:

```bash
git clone <repository-url>
cd Camp-Safety
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Run the development server:

```bash
npm run dev
```

## Production Build

Create a production build with:

```bash
npm run build
```

The application is deployed on Vercel, while database storage and server-side AI requests are handled through Supabase.

## Security

- The frontend uses a Supabase publishable key.
- Database access can be controlled using Supabase Row Level Security policies.
- The Gemini API key is stored as a Supabase Edge Function secret rather than in frontend environment variables.
- AI requests are routed through the Edge Function so the Gemini credential is never shipped to the browser.

## Future Improvements

Potential extensions include:

- user authentication and administrator accounts
- assessment history and dashboards
- comparison of assessments over time
- additional safety-assessment categories
- configurable risk rules
- downloadable assessment reports
- organization-level analytics
- transactional persistence of assessments and responses

## Live Application

**Camp Safety Assessment**

https://camp-safety-assessment.vercel.app/
