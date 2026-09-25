# IT Desk — Internal IT Knowledge Base

A simple, static IT information dashboard for storing and finding your
organization's device credentials, server info, activation/license codes,
and step-by-step configuration guides — built with plain HTML, CSS and
JavaScript so it can be hosted for free on **GitHub Pages**.

## Files

```
index.html   Page structure: login screen + dashboard shell
style.css    All styling (light theme, dark theme, responsive layout)
script.js    App logic: auth, theme, search, filters, rendering
data.js      All stored information, as plain JS arrays
README.md    This file
```

Everything runs in the browser. There is no build step, no server, and no
database — just open `index.html`, or host the folder on GitHub Pages.

## Running it

**Locally:** double-click `index.html`, or serve the folder with any static
server, e.g. `python3 -m http.server` then open `http://localhost:8000`.

**On GitHub Pages:**
1. Push these files to a GitHub repository (root of the repo, or a `/docs`
   folder — whichever you point Pages at).
2. In the repo, go to **Settings → Pages** and set the source branch/folder.
3. GitHub will give you a URL like `https://yourname.github.io/repo-name/`.

## Demo login

The login screen uses three sample accounts:

| Username | Password |
|----------|----------|
| User1    | 1234     |
| User2    | 5678     |
| User3    | 9012     |

Change or add accounts by editing the `users` array at the top of `data.js`.

## Adding your own information

All content lives in `data.js`, in plain arrays — `servers`, `credentials`,
`licenses`, `configurations`. To add a record, add another object to the
matching array using the same shape as the examples already there, save
the file, and refresh the page. No other code needs to change — every
array automatically renders using its type's card design, and is
automatically included in search, filtering and the dashboard totals.

Example — adding a new server:

```javascript
const servers = [
  // ...existing servers...
  {
    id: "srv-06",
    name: "Server06",
    hostname: "WEB-SERVER",
    ip: "192.168.1.15",
    mac: "00:1A:2B:3C:4D:63",
    vlan: "VLAN 10 - Servers",
    gateway: "192.168.1.1",
    dns: "192.168.1.2, 192.168.1.3",
    description: "Hosts the internal intranet site."
  }
];
```

Configuration guides work a little differently: each step is an object
with a `text` field, and an *optional* `command` field. Add a `command`
only on the steps that actually have one — the rest just render as plain
instruction text:

```javascript
steps: [
  { text: "Open the network settings panel" },                 // no command
  { text: "Confirm the new address applied", command: "ipconfig /all" }
]
```

Each record type has a matching `getX()` function at the bottom of
`data.js` (`getServers()`, `getCredentials()`, `getLicenses()`,
`getConfigurations()`). Every part of the UI reads data through these
functions rather than the arrays directly, so later on you can rewrite the
*inside* of a `getX()` function to call a real API or database, and
nothing in `script.js` or `index.html` needs to change.

## Features

- Login gate with a clear invalid-credentials message and a logout button
- Sidebar navigation: Dashboard, Credentials, Servers & Network, Activation
  & Licenses, and Configuration
- Global search across every record type, with a live result count
- Category filter chips (e.g. filter Configuration to just Ubuntu / Linux)
- Dashboard totals calculated live from the data arrays (never hardcoded)
- Passwords hidden by default, with **Show** and **Copy** actions
- Configuration guides shown as numbered, collapsible steps; a step can
  optionally include its own command block with a **Copy** button and
  toast confirmation, for the steps that actually have one
- The dashboard's "Recently useful" section uses a masonry-style layout,
  so cards of different heights pack together and fill the row instead of
  leaving empty space
- Both the light and dark themes share one SriLankan Airlines–inspired
  palette (deep maroon red + gold): light mode keeps it on a white/cream
  background, dark mode keeps the same maroon/gold hues on a near-black,
  maroon-tinted background rather than a neutral gray. Your choice is
  remembered on your device
- Fully responsive: sidebar collapses into a slide-in mobile menu

## ⚠️ Security notice — please read before storing real credentials

This project's login is a **prototype for demonstration only**:

- `users`, and every credential, license key, and command in `data.js`, are
  plain text sitting in a JavaScript file. **Anyone who can load the page
  can open their browser's developer tools and read every value**,
  logged in or not, because the "authentication" happens entirely in the
  browser.
- There is no password hashing, no server-side session, no encryption, no
  access control, and no audit log.
- Static hosting (like GitHub Pages) has no concept of private files —
  if the repository or site is reachable, so is `data.js`.

**Do not put real production credentials into this project as-is.** It is
meant to show the interface and interaction design, and to be a starting
point. For real internal use, replace the login and data layer with a
proper backend, for example:

- Server-side authentication with hashed passwords (e.g. bcrypt/argon2)
- Real session management (server sessions or signed JWTs) instead of
  `sessionStorage`
- Role-based access control
- HTTPS everywhere
- Data stored in a real database (PostgreSQL, MySQL, Firebase, etc.),
  accessed through an authenticated API — this is exactly what the `getX()`
  functions in `data.js` are structured to make easy to swap in later
- Secret management for anything highly sensitive (e.g. a vault service)
  rather than storing raw passwords even in a database
- Audit logging of who viewed or copied which credential and when

## Browser support

Built with standard HTML5, CSS3 (custom properties, grid/flexbox) and
vanilla JavaScript (ES6+). Works in current versions of Chrome, Edge,
Firefox and Safari. The clipboard copy buttons fall back automatically on
browsers/contexts where the modern Clipboard API isn't available.

---

Created by: **Thanushkar Sivakumar**
