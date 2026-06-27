# Assumption-Based Financial Modelling Engine

Static single-user MVP for the Strategy team assumption-based P&L modelling engine, updated against the SDD v2 product contract.

## Included in this build

- SDD-style formula cards with `source_text`, target line/year, method, params, dependencies, and validation status.
- Annual projection up to 10 years, or monthly projection up to 5 years.
- Named driver series for driver-linked assumptions.
- Editable P&L line structure with add, rename, reorder, remove, and dependency parking.
- Unit Economics with up to 8 segments, split methods, matrix view, and mini P&Ls.
- Scenario save/restore, undo/redo, audit trail, and export buttons for PDF/print, Word, Excel, CSV, and JSON.
- Local deterministic translator, plus a placeholder setting for a future live `/api/translate` backend.
- Contextual User Guide and Quick Start Guide, both available from every screen and printable as PDF from their guide screens.

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Push this folder to the repository.
3. In GitHub, open `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select branch `main` and folder `/ (root)`.
6. Save. GitHub will publish the site at:

   `https://<your-username>.github.io/<repository-name>/`

## Local Use

Open `index.html` directly, or serve the folder with any static file server.

## Notes

- The app is static HTML, CSS, and JavaScript.
- Scenarios are stored in each user's browser storage.
- There is no shared database or login in this zero-cost MVP.
- GitHub Pages can host the static app, but cannot run the live AI translator endpoint described as a future backend option in the SDD.
