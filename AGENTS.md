# Black Tie Console Working Context

This repository is now the working home for the Black Tie Photography media console. The code originated from the sibling `blacktiephotography` project at `C:\Users\pmister\source\repos\blacktiephotography`, where the relevant work is on branch `codex/console`.

## Imported Context

- Brand: Black Tie Photography, a portrait photography business based in northeast Ohio.
- Photographer/persona copy from the original homepage: Luci is a portrait photographer who specializes in equine photography and also offers other portrait sessions.
- Public social handle used across the original site: `@black.tie_photography`.
- Original site pages included `index.html`, `about.html`, `portfolio.html`, `contact.html`, service pages, and `console.html`.
- This repo is focused on the extracted console experience, plus shared CSS/JS needed by that experience.
- The original deployment config was Cloudflare Wrangler static assets with assets served from the project root.

## Console Intent

- The console is a private, prototype media workspace for managing Black Tie Photography site imagery.
- It is currently front-end only and stores state in browser `localStorage`.
- Prototype password is `blacktie`; this is not production authentication.
- Main storage keys:
  - `blacktie.console.images.v2`
  - `blacktie.console.authenticated`
- Primary sections:
  - `homeHero`: large homepage background
  - `intro`: welcome/about imagery
  - `service`: service feature imagery
  - `instagram`: homepage social image strip
- Expected controls include login/logout, section filtering, search, upload/drop, image preview, edit metadata, move section, replace, delete, reset, and export config.

## Design Direction

- Keep the console quiet, utilitarian, and work-focused.
- Preserve the dark editorial dashboard feel: dark navy/charcoal surfaces, restrained gold accent, and blue primary actions.
- Favor dense, scannable asset-management UI over marketing or landing-page presentation.
- Avoid adding a public landing page unless explicitly requested; the console itself should be the first-class experience.

## Notes From Import

- No committed Codex prompt, memory, `.codex`, or `.agents` files were found in either this repo or the sibling `blacktiephotography` checkout.
- Context above is inferred from the original project files, git branch names, and console implementation.
- Do not assume the local-only prototype behavior is production-ready without an explicit backend/storage/auth plan.
