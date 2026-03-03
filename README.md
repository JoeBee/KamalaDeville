# Kamala-Deville Website

A modern, responsive website for Kamala-Deville.com and KamalaDeville.com.

## Features

- Responsive design that works on mobile, tablet, and desktop
- Smooth scrolling navigation
- Contact form with validation (submits to Firebase Firestore, emails you on submission)
- Scroll-triggered animations
- Pure HTML, CSS, and JavaScript (Firebase via CDN)

## Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styles
- `script.js` - JavaScript functionality
- `firebase-config.js` - Generated from `.env` (not committed; run `npm run build` to create)
- `.env.example` - Template for Firebase config; copy to `.env` and fill in your values
- `functions/` - Cloud Functions (sends email when contact form is submitted)
- `Assets/` - Images and favicon
  - `favicon.ico`, `favicon.png` - Favicons
  - `kam-dev3.jpg` - Hero section background
  - `kam-dev5.jpg` - About section image

## Setup & Usage

1. **First-time setup:** Copy `.env.example` to `.env` and fill in your Firebase config values.
2. **Generate config:** Run `npm run build` to generate `firebase-config.js` from `.env`.
3. **View locally:** Open `index.html` in a browser (run `npm run build` first if `.env` changed).
4. **Deploy:** Run `npm run deploy` (builds and deploys) or `firebase deploy` after building.

**Note:** `.env` and `firebase-config.js` are in `.gitignore` and must not be committed. If `firebase-config.js` was previously in git, run `git rm --cached firebase-config.js` and commit to stop tracking it.

### Security (no secrets in GitHub or deploy)

| Item | GitHub | Deploy |
|------|--------|--------|
| `.env` | Ignored (not committed) | Ignored (not deployed) |
| `firebase-config.js` | Ignored (not committed) | Deployed (required for app) |
| Firebase API key | Not in repo | In client JS by design; restrict key in [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=kam-dev2) |
| Functions config (SMTP, etc.) | Stored in Firebase, not in repo | Stored in Firebase, not in repo |

### Contact form email notifications

To receive an email when someone submits the Contact form:

1. Set your SMTP config (run these one at a time):

   ```bash
   firebase functions:config:set mail.to="your@email.com"
   firebase functions:config:set smtp.host="smtp.gmail.com"
   firebase functions:config:set smtp.port="587"
   firebase functions:config:set smtp.user="your@gmail.com"
   firebase functions:config:set smtp.pass="your-app-password"
   ```

2. **Gmail users:** Create an [App Password](https://myaccount.google.com/apppasswords) — your regular password will not work.

3. Deploy functions: `firebase deploy --only functions`

## Customization

### Colors

Primary color scheme in `styles.css`:
- Main purple: `#553399`
- Hover purple: `#442288`

### Content

Edit `index.html` for company name, description, and contact form fields.

### Images

Change the hero background in the `#hero` section of `styles.css` (currently `Assets/kam-dev3.jpg`).

## Browser Compatibility

Chrome, Firefox, Safari, Edge (latest versions).
