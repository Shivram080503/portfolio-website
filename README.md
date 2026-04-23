# Shivram Shinde Portfolio Website

This repository contains a modern portfolio website generated from the provided resume and profile photo.

## Highlights

- React + Vite frontend running on modern JavaScript modules
- Node.js + Express backend for contact form submissions
- Fully responsive, attractive single-page portfolio
- Custom visual style with animated sections and premium typography
- Interactive 3D Skills Lab using Three.js
- Dynamic GitHub repository section fetched from public profile: Shivram080503
- Resume download support
- Rich portfolio sections: services, process, FAQ, education, direct contact methods

## Local Preview

Install dependencies and start the Vite development server:

```powershell
cd d:\PortfolioWebsite\portfolio-site
npm install
npm run dev
```

Then open the local URL printed by Vite.

To run the backend contact API locally in another terminal:

```powershell
cd d:\PortfolioWebsite\portfolio-site
npm run dev:server
```

## Production Build

```powershell
cd d:\PortfolioWebsite\portfolio-site
npm run build
```

The production files are generated in `dist/`.

## Full-Stack Start

After building, you can serve the frontend and contact API together with Express:

```powershell
cd d:\PortfolioWebsite\portfolio-site
npm run build
npm start
```

The app and API will run together on `http://localhost:8787`.

## Publish 24/7 using GitHub Pages

1. Create a new GitHub repository (for example `portfolio-website`).
2. Push this code:

```powershell
cd d:\PortfolioWebsite\portfolio-site
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/Shivram080503/portfolio-website.git
git push -u origin main
```

3. Enable GitHub Pages:
- Open repository settings.
- Go to Pages.
- Set source to `Deploy from a branch`.
- Choose branch `main` and folder `/ (root)`.

4. Your site will be live at:
- `https://shivram080503.github.io/portfolio-website/`

## Optional Custom Domain

To keep it live and branded 24/7 with your own domain:

1. Buy a domain from any provider.
2. In GitHub Pages settings, set Custom Domain.
3. Point DNS records (`A` and `CNAME`) as GitHub Pages requires.

## Notes

- GitHub API calls for repo cards require public internet access.
- Contact form submissions are stored in `server/data/submissions.json` at runtime.
- If you share 10th and 12th score details in text form, they can be added in a dedicated education subsection immediately.
