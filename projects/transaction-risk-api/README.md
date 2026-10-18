# Transaction Risk API

A beginner-friendly REST API built with **TypeScript**, **Node.js**, and **Express**. It assigns a simple rule-based risk score to a transaction and returns the risk level, flag status, and reasons.

> Educational demonstration only. Scores are heuristic and not calibrated fraud probabilities or suitable for real financial decisions.

## Features

- Strongly typed transaction and response interfaces
- Runtime validation for incoming JSON
- Rule-based risk scoring with human-readable reasons
- `GET /health` health check
- `POST /assess-risk` transaction assessment
- HTTP 400 responses for invalid inputs

## Prerequisites

Node.js 20 or later and npm.

## Setup

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000` by default.

## Test in PowerShell

```powershell
$body = @{ transactionId = "TXN1001"; amount = 8500; country = "US"; isInternational = $true; accountAgeDays = 5 } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/assess-risk -Method Post -ContentType "application/json" -Body $body
```

Expected response:

```json
{
  "transactionId": "TXN1001",
  "riskScore": 75,
  "riskLevel": "HIGH",
  "flagged": true,
  "reasons": ["High transaction amount", "International transaction", "New account"]
}
```

## Risk rules

| Condition | Points |
|---|---:|
| Amount >= 5,000 | +35 |
| International transaction | +25 |
| Account age < 30 days | +15 |

Score >= 60: HIGH; score >= 30: MEDIUM; otherwise LOW. Only HIGH risk transactions are flagged. The `country` field is included for contextual metadata but is not used by the current scoring rules.

## Scripts

- `npm run dev`: start server with auto-reload
- `npm run typecheck`: validate TypeScript types
- `npm run build`: compile TypeScript to `dist/`
- `npm start`: run compiled JavaScript

## Project structure

```text
src/
  risk.ts       # Types, validation, and scoring logic
  server.ts     # Express server and HTTP endpoints
```

## Learning notes

- **TypeScript** provides compile-time type checking.
- **Node.js** executes the compiled JavaScript.
- **Express** routes HTTP requests to application code.
- **Interfaces** describe data structures but do not validate network inputs; `isTransaction` does runtime checks.
- **Functions** make scoring logic reusable and testable.

## Future improvements

- Unit tests and integration tests
- Configurable thresholds
- More fraud signals, transaction history, and persistence
- Model-based scoring with evaluated performance metrics

## License

MIT
