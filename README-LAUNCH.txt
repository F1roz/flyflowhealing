FLYFLOWHEALING WEBSITE: HOW TO LAUNCH

This folder is the complete website. No build step, no plugins.
Upload the whole folder to any static host:
  - Netlify or Vercel: drag the folder onto the dashboard (free plan works)
  - Any web host: upload everything to public_html / the site root

BEFORE GOING LIVE
1. Domain: every page uses https://flyflowhealing.vercel.app for SEO links.
   If her domain is different, when she gets her own domain, find-and-replace that address in all
   .html files, sitemap.xml and robots.txt.
2. After launch, add the site in Google Search Console and submit
   /sitemap.xml so Google finds every page.

PAGES
  index.html            Home
  about.html            About Ashley
  method.html           The JOY Connection Map
  work-with-me.html     Mentoring, circles, retreats + FAQ
  blog/                 The Lovelight Journal + 3 articles
  contact.html          Booking, email, phone, Instagram, note form
  404.html              Page-not-found (most hosts pick this up automatically)

ADDING A NEW BLOG POST
  Copy one of the files in /blog, change the title, description, date and
  text, then add a card for it on blog/index.html and a line in sitemap.xml.

CONTACT FORM
  The "Send a note" form opens the visitor's email app with the message
  ready to send to flyflow.mentoring@gmail.com. To receive messages
  directly instead, connect a form service (for example Netlify Forms or
  Formspree) to the form.

BUILT FOR SPEED & SEO
  - Self-hosted fonts and WebP photos, lazy-loaded below the fold
  - No frameworks; one CSS and one JS file
  - Unique title, description, social image and structured data on
    every page; sitemap.xml and robots.txt included
  - Custom cursor and motion switch off automatically on touch screens
    and for visitors who prefer reduced motion
