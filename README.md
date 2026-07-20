<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Jiyo Long Life

This repository contains the full app source for the Jiyo Long Life experience, ready to run locally and publish to GitHub Pages.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
3. Start the development server:
   `npm run dev`

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In the repository settings, add a repository secret named `GEMINI_API_KEY`.
3. Enable GitHub Pages in the repository settings and choose the GitHub Actions deployment source.
4. The workflow in [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) will build and publish the app automatically on every push to `main`.
