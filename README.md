# Punch Walk

Phone web app for 7 Brew stand hand-over punch walks. It installs to the home screen, works fully offline, and runs without any outside service.

## What it does
- Loads the team checklist (Master V3, 228 items) and groups items by location.
- Marks each item Complete, Not complete or N/A, with notes, responsible party and final approval.
- Takes unlimited photos per item and lets you mark them up with arrows, circles, boxes and freehand.
- Builds a PDF report, an Excel punch list and a .zip of photos, then shares them through the phone's share sheet (Mail, Dropbox, OneDrive, Files).

## Data and security
- Walks, notes and photos are stored only on the phone that took them. Nothing is sent to a server.
- The checklist is stored in `template.enc.json`, encrypted with AES-256-GCM using a key derived from a team passcode (PBKDF2-SHA256, 310,000 iterations). The repo holds no readable checklist content.
- The passcode is never stored in the repo. Share it with the team separately.
- All libraries and fonts are bundled in `vendor/` and `fonts/`, so the app makes no third-party requests.
- Hosting must be approved by APMG IT before this goes live. GitHub Pages on non-Enterprise plans serves the site publicly, even from a private repo.

## Files
| Path | Purpose |
|---|---|
| `index.html` | The app |
| `sw.js` | Service worker that caches the app for offline use |
| `manifest.webmanifest`, `icons/` | Home screen install |
| `template.enc.json` | Encrypted team checklist |
| `vendor/` | SheetJS 0.18.5 (Excel), jsPDF 2.5.1 (PDF), JSZip 3.10.1 (zip) |
| `fonts/` | Barlow, Barlow Condensed, IBM Plex Mono (SIL Open Font License) |

## Install on a phone
1. Open the site URL with signal.
2. iPhone: Safari > Share > Add to Home Screen. Android: Chrome > menu > Add to Home screen.
3. Open the app from the home screen and enter the team passcode once.

After that the app opens and runs with no signal. Use the home screen icon: iOS keeps home screen app data, but may clear browser-tab data after a period of non-use.

## Move a walk to a computer
1. On the phone, open the walk, tap the settings icon (Walk details), then **Save full walk file**.
2. Save the file to OneDrive, Dropbox or Files, or email it to yourself.
3. On the computer, open the app URL in Chrome, Edge or Safari, and click **Open a walk file**.
4. Keep working there. Save a new full walk file whenever you want a copy to move back or archive.

The file holds everything: items, notes, photos, site photos and vendor updates. Once it is saved, the walk can be deleted from the phone. Opening a file for a walk that is already on the device offers **Replace** or **Keep both**.

## Vendor updates (file exchange)
1. In the walk, tap **Vendor updates**. Pick the responsible party, enter your email, and tap **Build vendor task file**.
2. Email the task file to the vendor with the vendor page link (`vendor.html` on this site) and the stand number as the password. **Copy instructions for the vendor** gives the email text.
3. The vendor opens the page, loads the file, enters the stand number and their name and email, then adds completion photos and notes and marks tasks complete. They cannot change the original items. Their work is saved in their browser until they send it.
4. The vendor clicks **Create response file** and emails it back.
5. In the walk, tap **Vendor updates > Load a vendor response file**. Accept marks the item Complete and adds the vendor photos and notes; Deny keeps it Not complete with a reason. **Email vendor** opens a drafted email with the results.

Vendor files are encrypted with the stand number (AES-256-GCM, PBKDF2). Stand numbers are not secret, so treat this as light protection. Vendors never need the team passcode.

## Update the checklist
1. In the app, open Template options > Update the team checklist.
2. Enter a passcode (a new one or the current one) and choose the updated Excel workbook.
3. Save the generated `template.enc.json` and commit it to the repo, replacing the old file.
4. Phones pick it up the next time the app opens with signal. If the passcode changed, each phone asks for it once and keeps using the old list until then. Walks already started keep their original list.

The workbook needs a header row with `NO`, `Item`, `Division`, `Location` and `Resp.` columns. Rows whose Item reads "Description" are skipped. An optional `DATA` sheet adds to the Division, Location and Resp. lists.

## Release an app update
Edit the files, then change `VERSION` in `sw.js` (for example `punch-walk-v2`) so phones download the new version. Open apps show an "Update" bar; tapping it saves the current walk and reloads.
