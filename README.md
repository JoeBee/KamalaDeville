# Kamala-Deville Website

A modern, responsive website for Kamala-Deville.com and KamalaDeville.com.

## Features

- Responsive design that works on mobile, tablet, and desktop
- Smooth scrolling navigation
- Contact form with validation (submits to Firebase Firestore)
- Scroll-triggered animations
- Pure HTML, CSS, and JavaScript (Firebase via CDN)

## Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styles
- `script.js` - JavaScript functionality
- `firebase-config.js` - Firebase initialization (Analytics, Firestore)
- `Assets/` - Images and favicon
  - `favicon.ico`, `favicon.png` - Favicons
  - `kam-dev3.jpg` - Hero section background
  - `kam-dev5.jpg` - About section image

## Usage

1. Open `index.html` in a browser to view locally.
2. Deploy to Firebase: `npm run deploy` or `firebase deploy`

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
