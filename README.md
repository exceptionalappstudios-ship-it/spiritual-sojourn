# Spiritual Sojourn 2026 landing pages

Two pages for the Spiritual Sojourn with Gurudev at Guru Sanidhya (6–12 Nov 2026, Gujarat Ashram, Vasad).

| Page | URL | What the Register button does |
|---|---|---|
| Payment | `/pay/` | Opens `PAYMENT_URL` directly |
| WhatsApp first | `/register/` | Asks for a WhatsApp number, then opens `REGISTER_URL` |

## Going live (GitHub Pages)

In this repo on GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, pick `main` and `/ (root)`, then Save. After a minute the pages are at:

- https://exceptionalappstudios-ship-it.github.io/spiritual-sojourn/pay/
- https://exceptionalappstudios-ship-it.github.io/spiritual-sojourn/register/

If you use your own domain, update `SITE` in `build.py` and rebuild.

## Change links, dates, seats

Edit the block at the top of `assets/gg.js`:

- `PAYMENT_URL`: payment link for the pay page (now the TinyURL registration link)
- `REGISTER_URL`: where the WhatsApp page sends people after they submit
- `EVENT_START` / `EVENT_END`: drive the countdown
- `SEATS_TOTAL` / `SEATS_LEFT`: set both to real numbers to show the "seats taken" bar. It stays hidden while either is `null`.
- `PIXEL_ID`: optional Meta Pixel for ads (PageView, InitiateCheckout, Lead)

## Change the copy

All text is in `template.html`. Parts marked `<!--pay-->…<!--/pay-->` or `<!--lead-->…<!--/lead-->` appear on only one page. After editing, rebuild both pages:

```
python3 build.py
```

## Save WhatsApp numbers to a Google Sheet (optional)

1. Create a Google Sheet. Go to **Extensions → Apps Script** and paste:

```js
function doPost(e) {
  var p = e.parameter;
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
    new Date(), p.phone, p.page, p.utm_source || "", p.utm_campaign || "", p.utm_content || ""
  ]);
  return ContentService.createTextOutput("ok");
}
```

2. Click **Deploy → New deployment → Web app**. Set *Execute as: Me* and *Who has access: Anyone*, then deploy.
3. Copy the web-app URL into `LEAD_ENDPOINT` in `assets/gg.js`.

Numbers are sent in the background, so people go to registration without waiting.

## Animations

Animations are CSS-only and use transform/opacity. Looping ones pause when off-screen, and all of them switch off for visitors whose phone is set to reduce motion.
