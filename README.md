# Enoch Okumagbe — Portfolio (Astro)

Migrated from a single-file HTML site to Astro, specifically so case studies
can grow past 8 without hand-editing layout code every time.

## What changed from the old single-file version

- Same visual design, same fonts, same animations — nothing about how it
  looks or behaves changed.
- Case studies now live as **Markdown files** in `src/content/case-studies/`
  instead of copy-pasted HTML blocks. Adding a 9th one means adding a file,
  not touching any layout code.
- The old manually-placed 3-row grid (`proj-row-1`, `proj-row-2`, `proj-row-3`)
  is gone. The grid now auto-flows and scales to any number of case studies —
  a card marked `featured: true` in its frontmatter spans two columns,
  everything else is one column.
- The 7th project ("Google Sheets Automation Dashboard") was missing from the
  live single-file site despite the homepage claiming "8 real systems." It's
  restored here, and the "8" in the headline is now computed from the actual
  number of files in `case-studies/` — it can't drift out of sync again.
- There's now a real `/work` page listing every case study, and a real page
  per case study at `/work/[slug]` — each one is a shareable URL, not just a
  card on the homepage.

## Adding a new case study

Create a new file in `src/content/case-studies/`, e.g. `my-new-project.md`:

```markdown
---
title: "Project Title"
industry: "Client Industry · Category"
problem: "One or two sentences — what was broken before."
outcome: "One line — the result, shown on the card."
stack: ["Tool One", "Tool Two"]
client: "Client Name"          # optional
featured: false                 # true = spans 2 grid columns
tinted: false                   # true = subtle teal card tint
order: 9                        # display order, lower = earlier
---

The full write-up for the case study detail page goes here, in Markdown.
Write two or three paragraphs — this is what visitors see when they click
through from the card.
```

Save it, redeploy (or just `git push` if connected to Vercel) — it appears
on the homepage (if featured), on `/work`, and gets its own detail page
automatically. No other file needs to change.

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Deploying

Push this whole folder to a GitHub repo, then import it on
[vercel.com/new](https://vercel.com/new). `vercel.json` pins the Astro
framework preset explicitly, so there's no ambiguity for Vercel to guess at.
No further configuration needed — Vercel runs `astro build` and serves
`dist/` automatically.

## Contact form

Uses [FormSubmit](https://formsubmit.co) — no account needed, sends
straight to `okumagbeenoch4@gmail.com`. The **first-ever submission** on a
freshly deployed domain triggers a one-time confirmation email from
FormSubmit — click the link in it once, and every submission after that
is delivered automatically. This is documented FormSubmit behavior, not a
bug: it exists to stop spam bots from registering random inboxes.
