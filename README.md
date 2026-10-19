# PRIYAN Notes AI

A runnable local engineering study workspace with concept retrieval, an optional eve AI tutor, an optional local Ollama model, and an extensible bilingual dataset.

## Run immediately — no model or npm installation required

Install **Node.js 24 or newer**. Extract this folder, then in PowerShell/Terminal:

```powershell
cd priyan-notes-ai
node --env-file-if-exists=.env server.mjs
```

Open **http://127.0.0.1:3210**. On Windows you can also double-click `start_windows.bat`. Keep that terminal open. Stop with Ctrl+C. The default retrieval mode needs no GPU, model, API key or internet connection. It returns existing explanations; it does not generate new solutions or new translations.

## What works

- Responsive learning dashboard, department filter, searchable concept library and saved notes.
- English and Thanglish authored explanations, worked examples, formulas and misconception reminders.
- Explanation, quick-revision and quiz prompts, with visible source and review labels.
- Bookmarks, quiz attempts, imported notes, review state and recent questions persisted to `runtime/state.json` across restarts.
- TXT/Markdown and JSON/JSONL import; text-based PDF import with the optional extractor below.
- Source/license metadata, permission declaration, exact duplicate detection and human review for uploads.
- Exact university, regulation and semester filters; absent syllabus coverage is stated honestly.
- JSONL export of all current notes, batch folder ingestion and exact curriculum coverage reports.
- A real eve agent with a typed `search_notes` retrieval tool. Optional default shell/file/network tools are disabled.

## Dataset included

**54 unique concepts across nine subject groups, 108 derived bilingual instruction examples.** See `DATASET_CARD.md`, `data/manifest.json`, `data/concepts.json`, `.jsonl`, `.csv`, and `data/instructions.jsonl`.

These are AI-authored unreviewed starter notes, **not a verified four-year university syllabus**. University/regulation information is needed to complete that corpus. Shared fundamentals have a COMMON label. Starter semester and unit fields are intentionally null rather than invented.

## Enable PDF uploads

Install Python 3.10+ and run:

```powershell
python -m pip install -r requirements-pdf.txt
```

If your Python command is `python3`, copy `.env.example` to `.env` and set `PYTHON=python3`. Text extraction keeps page references but does not guarantee equation/table fidelity. Image-only scans need OCR before importing. UI uploads are limited to 5 MB; requests to 8 MB; PDF extraction to 300 pages and 30 seconds. Split large documents first. Review against the source before marking a record reviewed.

## Enable the eve AI tutor

The dashboard defaults to retrieval. To generate fresh explanations using eve:

```powershell
npm ci
npm run agent
```

Use eve's `/login` in that terminal to connect an authorized model account. The scaffold's model is `openai/gpt-6-luna-fast`; use `/model` if your connection requires a different available model. Model access and charges depend on your selected provider. No credentials are bundled.

Copy `.env.example` to `.env`, change `NOTES_MODEL_MODE=eve`, then in a **second terminal** run `npm start`. The dashboard talks to eve on `127.0.0.1:2000`. Both processes must remain open. For a previously configured connection, `npm run agent:server` starts eve without its terminal UI. Keep both services loopback-only.

When using a hosted model, the question and up to four retrieved notes are sent as model context; the agent may retrieve additional relevant notes with its tool. Choose material permitted for that provider. This project does not automatically enroll accounts, send data on startup, or use a model in retrieval mode. The framework's own build/runtime metadata requests are controlled by eve.

## Optional fully local generation

Install and start Ollama separately, download a model appropriate for your machine, then set:

```dotenv
NOTES_MODEL_MODE=ollama
OLLAMA_MODEL=your-exact-installed-model-name
```

Restart the dashboard with `npm start`. It calls only `http://127.0.0.1:11434/api/chat`. Model weights are not bundled. This path uses direct grounded generation; the eve tool agent remains available as the separate mode above. Live generation requires a functioning installed model and has not been validated against model weights in this build.

## Add your department's notes

In Dataset Studio choose a file, department, subject, university, regulation, semester and source permission. Imported text/PDF pages become searchable chunks immediately. For structured metadata and quizzes, adapt `data/import-example.json`; replace every placeholder. Import arrays as JSON or one record per line as JSONL. User-provided IDs and review labels are not trusted: the importer assigns new IDs and starts every record unreviewed. The entire request is validated before it is written.

For larger licensed collections:

```powershell
node scripts/import_folder.mjs ./licensed-notes ./metadata.json
npm run dataset:export
node scripts/coverage.mjs ./official-syllabus.json
```

The folder metadata JSON needs `permissionConfirmed: true`, `department`, `subject` and `source: {"title":"Collection name","license":"Actual permission"}`. Folder import supports TXT, Markdown, JSON and JSONL; use the dashboard for PDF extraction. Each file is an atomic batch; earlier files remain imported if a later file fails. The lightweight index scans the local corpus and is intended for a starter/pilot, not millions of records. At that scale migrate storage to a database and use an indexed hybrid retriever with a background ingestion queue. No claim of large-scale load testing is made.

## Checks

```powershell
npm test
npm run dataset:validate
npm run typecheck
```

The bundled tests exercise PDF page extraction/blank-document handling (optional pypdf required), live local HTTP behaviour, filtering and insufficient-evidence responses, atomic imports and duplicate handling, permissions, bookmarking, quiz/review state, restart persistence, export and origin restrictions. Typechecking requires `npm ci`. Dataset validation checks structure rather than academic truth.

Framework packaging is `npm run build`; during authoring its external Gateway access was blocked by automatic approval review, so successful eve packaging and live model responses are **not verified**. Browser rendering was not visually tested in this environment. Local server/API and dataset checks are independent of those limitations. See `VALIDATION.md`.

## Files and boundaries

- `server.mjs`: local HTTP API, static UI, model adapter and PDF extraction bridge.
- `lib/`: persistence, validation and lexical retrieval.
- `agent/`: eve instructions, model configuration and typed retrieval tool.
- `public/`: dashboard HTML/CSS/JavaScript, with no external font or CDN dependencies.
- `data/`: starter corpus, exports, examples and manifests.
- `scripts/`: reproducible starter generation, validation, export, batch import and coverage reporting.
- `tests/`: automated local integration checks.

This is a **single-user local application**. It deliberately binds to 127.0.0.1 and has no multi-user authentication. Back up `runtime/state.json` for your own imported work. It is not a hosted college-wide production service. No pretrained model, fine-tuned checkpoint, full syllabus scrape, scanned-document OCR or diagram-generation model is included. The offline tutor retrieves the best supported stored note and refuses weak matches; it is not a general-purpose reasoning model.
"# Notes_AI_Agent_Dataset_v0.1" 
