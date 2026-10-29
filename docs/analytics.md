# Analytics

Two counters run side by side, both without cookies:

- **Vercel Web Analytics** (`@vercel/analytics` in `Base.astro`). Already on. Hobby keeps 31 days and has no click events.
- **Umami**, self-hosted and open source (MIT). Keeps history as long as its database lives, counts clicks out, and can hold every one of Antonio's sites in one dashboard.

Neither sees bots that don't run JavaScript. Only server logs would.

## What the site sends

`Base.astro` adds Umami's script only when the build has both `PUBLIC_UMAMI_HOST` (the Umami server, such as `https://antoniwan-stats.vercel.app`) and `PUBLIC_UMAMI_WEBSITE_ID`. Local builds and any build without them stay script-free.

- `data-domains="antoniwan.online"`: hits from previews, localhost, or a copy of the site are dropped.
- `data-do-not-track="true"`: a browser that sends Do Not Track is not counted.
- Every link to another site carries the click event `outbound`, with `to` (the host) and `url` (the address without its query). The middleware adds it at build time (`src/utils/outbound.ts`); NoteList adds it to the essays it redraws. In Umami, Events → `outbound` → the `to` property shows how many people left for Lifesworn, Unblinking's GitHub, Uplift, Notes, and the rest.
- Every call to action carries the click event `cta`, with `label` naming it: `read-my-writing`, `about-me`, `every-post`, `consulting`, `email`, `company`, `source`, `pause-animation`, `back-to-top`, `now-playing-visit`, `all-films`, `letterboxd-diary`, `egg-start`, `clear-filters`, and `project-<id>` for each button on Projects. Add one with `{...cta('name')}` (`src/utils/cta.ts`). A call to action that leaves the site also gets `to` and `url` and skips `outbound`, so each click is counted once. Tasteless lists every label beside its page's views, to find the ones nobody uses.
- Incoming `?utm_*` tags show under Umami's UTM report.

Umami stores no IP address and sets no cookie. It makes a visitor ID from a hash of the IP, the browser, and a salt that changes every month, then keeps only the country, region, city, device, browser, page, referrer, and time.

The script and its hits go straight to the Umami server, not through a rewrite on this domain. Vercel replaces the visitor's IP on proxied requests, and Umami needs it to tell visitors apart and place them; through a proxy every visitor would look like one person in one city. The server instead renames its script to `/p.js` and its hit endpoint to `/api/k`, which the common blocklists don't match.

## Setting up the server

Do this once. The same server takes other sites later: add a website in Umami and set the two variables on that site's Vercel project.

1. **Make the server.** Either:
   - **Vercel + Neon (free).** In the SHSH team, New Project → Clone template → `https://github.com/umami-software/umami` (Vercel copies it into a repo of yours). Name the repo `umami`, since it is Umami and stays easy to sync with upstream. Name the Vercel project `antoniwan-stats`: it serves every site, and it becomes the public address, where a name without "umami" is one fewer thing for blocklists to match. Then Storage → Create Database → Neon, free plan, connect it to the project for all environments. That sets `DATABASE_URL`. In Settings → Git → Ignored Build Step, choose "Only build production", so pushes to other branches don't spend the 100-a-day deploy cap.
   - **Railway.** In the project that runs Remark42, New → Template → Umami (it brings its own Postgres). Settings → Networking → Generate Domain.
2. **Set the server's variables**, then redeploy it:
   - `TRACKER_SCRIPT_NAME` = `p.js`
   - `COLLECT_API_ENDPOINT` = `/api/k`
   - `DISABLE_TELEMETRY` = `1`
   - `APP_SECRET` = a long random string (`openssl rand -hex 32`)
3. **Sign in** at the server's address as `admin` / `umami` and change the password right away (Settings → Profile).
4. **Add the website.** Settings → Websites → Add website: name `antoniwan.online`, domain `antoniwan.online`. Copy its Website ID.
5. **Point the site at it.** On the `antoniwan-online` Vercel project, Settings → Environment Variables, Production only:
   - `PUBLIC_UMAMI_HOST` = the server's address, no trailing slash
   - `PUBLIC_UMAMI_WEBSITE_ID` = the ID from step 4

   They are read at build time, so the next deploy of `main` turns Umami on.
6. **Check it.** Open the site in a private window, then Umami's Realtime view. A visit should appear within a few seconds, placed in the right city.

## Not counting yourself

On each browser you use, open antoniwan.online, then the developer console, and run:

```js
localStorage.setItem('umami.disabled', 1);
```

Umami skips that browser from then on. `localStorage.removeItem('umami.disabled')` undoes it.

## Upkeep

- Update Umami by syncing its repo with upstream (Vercel) or redeploying the template (Railway). Read its release notes first; major versions migrate the database.
- Neon's free plan pauses an idle database and wakes it on the next hit. The first visit after a quiet spell takes a second or two longer to record; the page itself doesn't wait.
