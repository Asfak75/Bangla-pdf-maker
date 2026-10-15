BANGLA PDF MAKER

Files:
- index.html : webpage structure
- style.css  : layout and print styling
- script.js  : word count, preview and print-to-PDF behavior

HOW TO USE LOCALLY
1. Keep all three files in the same folder.
2. Open index.html in Chrome, Edge, or Firefox.
3. Paste text, adjust settings, click “PDF হিসেবে সেভ করুন”.
4. In the print dialog choose “Save as PDF”.

HOW TO PUBLISH WITH GITHUB + NETLIFY
1. Sign in to GitHub and create a new repository, e.g. bangla-pdf-maker.
2. Upload index.html, style.css, and script.js to the repository root (not inside another nested folder).
3. Open Netlify and choose Add new site > Import an existing project.
4. Connect GitHub, select the bangla-pdf-maker repository, and authorize access if asked.
5. Build command: leave blank. Publish directory: . (a single dot).
6. Click Deploy site. Wait for the deploy to finish, then open the generated Netlify URL.
7. When changing code later, commit the updated files to GitHub; Netlify redeploys automatically.

NOTES
- No database, login, backend, or user storage is used.
- PDF is created through the browser's print dialog, which is a robust way to preserve Unicode/Bengali shaping. The user must choose “Save as PDF” in that dialog.
- Font availability can vary by device. The page requests common Bengali-capable system fonts; for best consistency, use a device/browser with a Bengali Unicode font installed.
