# Repoxana

Repoxana is a curated GitHub repository catalog in Azerbaijani. It helps users discover useful open-source projects across AI, developer tools, self-hosted apps, design resources, education, productivity, and more.

## Features

- Azerbaijani descriptions for curated GitHub repositories
- Search, category filtering, and sorting
- Featured "Repo of the Day" section
- Repository detail pages with images, tags, and summaries
- Static deployment with Cloudflare Pages

## Project Structure

- `index.html` - homepage
- `repo.html` - repository detail page
- `repos.js` - repository catalog and metadata
- `storage.js` - local data synchronization logic
- `styles.css` - UI styling
- `app.js`, `repo-detail.js`, `admin.js` - frontend logic

## Local Usage

This project is a simple static site, so you can run it with any local static server.

Example:

```bash
npx serve .
```

Then open the local URL in your browser.

## Live Site

- Production: [https://repoxana.pages.dev/](https://repoxana.pages.dev/)

## Deployment

Repoxana is deployed with Cloudflare Pages.

## Purpose

The goal of this project is to make high-quality open-source repositories easier to explore for Azerbaijani-speaking users, with short explanations, practical use cases, and category-based discovery.
