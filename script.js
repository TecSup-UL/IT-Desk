/* ==========================================================================
   script.js
   IT Information Management Dashboard
   Sections: Icons, State, Auth, Theme, Utilities, Card renderers,
             View rendering, Search, Navigation, Init
   ========================================================================== */

/* -------------------------------------------------------------------------
   Inline icon set (no external icon library / font dependency)
   ------------------------------------------------------------------------- */
const ICONS = {
  dashboard: '<path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  server: '<rect x="3.5" y="4" width="17" height="6.5" rx="1.2"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.2"/><circle cx="7" cy="7.2" r=".9" fill="currentColor" stroke="none"/><circle cx="7" cy="16.7" r=".9" fill="currentColor" stroke="none"/>',
  key: '<circle cx="8" cy="12" r="4"/><path d="M11.5 12H20M16.5 12v3M20 12v3"/>',
  tool: '<path d="M14.5 6.5 17.5 3.5a4.5 4.5 0 0 1-6 6L4 17l3 3 8.5-8.5a4.5 4.5 0 0 1 6-6L18.5 8.5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/>',
  moon: '<path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2Z"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/>',
  eyeOff: '<path d="M3 3l18 18M10.6 10.7a2.6 2.6 0 0 0 3.6 3.6M6.6 6.9C4.3 8.4 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.8 0 3.3-.5 4.6-1.3M9.8 5.7A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-2.8 3.7"/>',
  copy: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="1.4"/><path d="M15.5 8.5V5.9A1.4 1.4 0 0 0 14.1 4.5H5.9A1.4 1.4 0 0 0 4.5 5.9v8.2a1.4 1.4 0 0 0 1.4 1.4h2.6"/>',
  logout: '<path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9"/><path d="M14 16l4.5-4-4.5-4M18.3 12H9"/>',
  menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>'
};

function icon(name, extraClass) {
  return `<svg class="icon ${extraClass || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

/* -------------------------------------------------------------------------
   Application state
   ------------------------------------------------------------------------- */
const state = {
  activeView: "dashboard",
  activeFilter: "All",
  searchTerm: "",
  sidebarOpen: false
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "credentials", label: "Image Credentials", icon: "lock" },
  { id: "servers", label: "Servers & Network", icon: "server" },
  { id: "configurations", label: "Configuration", icon: "tool" }
];

const VIEW_TITLES = {
  dashboard: "Dashboard",
  credentials: "Image Credentials",
  servers: "Servers & Network",
  configurations: "Configuration"
};

/* -------------------------------------------------------------------------
   Utilities
   ------------------------------------------------------------------------- */
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.getElementById("toastContainer").appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast-visible"));
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 250);
  }, 1900);
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    return true;
  } catch (e) {
    return false;
  }
}

/* -------------------------------------------------------------------------
   Theme (light / dark) — persisted in localStorage
   ------------------------------------------------------------------------- */
const THEME_KEY = "itdash-theme";

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const theme = saved === "dark" ? "dark" : "light";
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.innerHTML = icon(theme === "dark" ? "sun" : "moon") +
      `<span>${theme === "dark" ? "Light mode" : "Dark mode"}</span>`;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
}

/* -------------------------------------------------------------------------
   Authentication (prototype only — see README for production notes)
   ------------------------------------------------------------------------- */
const SESSION_KEY = "itdash-session-user";

function attemptLogin(username, password) {
  const match = getUsers().find(
    (u) => u.username === username && u.password === password
  );
  return match || null;
}

function startSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username, role: user.role }));
}

function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function endSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorEl = document.getElementById("loginError");

  const user = attemptLogin(username, password);
  if (!user) {
    errorEl.textContent = "Incorrect username or password. Please try again.";
    errorEl.hidden = false;
    document.getElementById("loginPassword").focus();
    return;
  }
  errorEl.hidden = true;
  startSession(user);
  enterApp(user);
}

function handleLogout() {
  endSession();
  document.getElementById("app").hidden = true;
  document.getElementById("loginScreen").hidden = false;
  document.getElementById("loginForm").reset();
  document.getElementById("loginUsername").focus();
}

function enterApp(user) {
  document.getElementById("loginScreen").hidden = true;
  document.getElementById("app").hidden = false;
  document.getElementById("currentUserName").textContent = user.username;
  document.getElementById("currentUserRole").textContent = user.role;
  state.activeView = "dashboard";
  state.activeFilter = "All";
  state.searchTerm = "";
  document.getElementById("globalSearch").value = "";
  renderSidebar();
  renderMain();
}

/* -------------------------------------------------------------------------
   Card renderers — one consistent design per record type
   ------------------------------------------------------------------------- */
function cardShell(accentClass, stubIcon, bodyHtml) {
  return `
    <article class="card ${accentClass}">
      <div class="card-stub" aria-hidden="true">${icon(stubIcon)}</div>
      <div class="card-body">${bodyHtml}</div>
    </article>`;
}

function createServerCard(s) {
  return cardShell("card-server", "server", `
    <div class="card-head">
      <h3>${escapeHtml(s.name)}</h3>
      <span class="tag tag-server">Server</span>
    </div>
    <p class="card-desc">${escapeHtml(s.description)}</p>
    <dl class="kv-grid">
      <div><dt>Hostname</dt><dd class="mono">${escapeHtml(s.hostname)}</dd></div><br>
      <div><dt>User Name</dt><dd class="mono">${escapeHtml(s.username)}</dd></div>
      <div><dt>Password</dt><dd class="mono">${escapeHtml(s.password)}</dd></div>
    </dl>
  `);
}

function createCredentialCard(c) {
  return cardShell("card-credential", "lock", `
    <div class="card-head">
      <h3>${escapeHtml(c.device)}</h3>
      <span class="tag tag-credential">${escapeHtml(c.category)}</span>
    </div>
    <dl class="kv-grid kv-grid-tight">
      <div><dt>Username</dt><dd class="mono">${escapeHtml(c.username)}</dd></div>
      <div>
        <dt>Password</dt>
        <dd class="password-row">
          <span class="mono password-value" data-cred-id="${escapeHtml(c.id)}" data-revealed="false">••••••••••••</span>
          <button type="button" class="btn-icon" data-action="toggle-password" data-cred-id="${escapeHtml(c.id)}" aria-label="Show or hide password">
            ${icon("eye")}
          </button>
          <button type="button" class="btn-icon" data-action="copy-password" data-cred-id="${escapeHtml(c.id)}" aria-label="Copy password">
            ${icon("copy")}
          </button>
        </dd>
      </div>
    </dl>
    ${c.notes ? `<p class="card-note">${escapeHtml(c.notes)}</p>` : ""}
  `);
}

function renderStepItem(step) {
  const hasCommand = Boolean(step.command);
  const encoded = hasCommand ? encodeURIComponent(step.command) : "";
  return `
    <li>
      <p class="step-text">${escapeHtml(step.text)}</p>
      ${hasCommand ? `
        <div class="code-block code-block-sm">
          <div class="code-block-head">
            <span>Command</span>
            <button type="button" class="btn-copy" data-action="copy-command" data-command="${encoded}">
              ${icon("copy")} Copy
            </button>
          </div>
          <pre class="mono">${escapeHtml(step.command)}</pre>
        </div>` : ""}
    </li>`;
}

function createConfigurationCard(cfg) {
  return cardShell("card-configuration", "tool", `
    <details class="steps-details">
      <summary>
        <div class="card-head card-head-summary">
          <h3>${escapeHtml(cfg.title)}</h3>
          <span class="tag tag-configuration">${escapeHtml(cfg.category)}</span>
        </div>
        ${icon("chevronDown", "chevron")}
      </summary>
      <ol class="steps-list">
        ${cfg.steps.map(renderStepItem).join("")}
      </ol>
    </details>
  `);
}

/* -------------------------------------------------------------------------
   Dataset registry — used by both category views and global search
   ------------------------------------------------------------------------- */
const DATASETS = {
  servers: {
    label: "Servers", get: getServers, render: createServerCard, filterKey: null,
    match: (s) => [s.name, s.hostname, s.ip, s.mac, s.vlan, s.description]
  },
  credentials: {
    label: "Image Credentials", get: getCredentials, render: createCredentialCard, filterKey: "category",
    match: (c) => [c.device, c.username, c.category, c.notes]
  },
  configurations: {
    label: "Configuration", get: getConfigurations, render: createConfigurationCard, filterKey: "category",
    match: (c) => [c.title, c.category, ...(c.steps || []).flatMap((s) => [s.text, s.command])]
  }
};

/* -------------------------------------------------------------------------
   Sidebar
   ------------------------------------------------------------------------- */
function renderSidebar() {
  const nav = document.getElementById("sidebarNav");
  nav.innerHTML = NAV_ITEMS.map((item) => {
    const isActive = state.activeView === item.id && !item.children;
    const parentActive = state.activeView === item.id;
    let html = `
      <button type="button" class="nav-item ${parentActive ? "nav-item-active" : ""}" data-nav="${item.id}">
        ${icon(item.icon)}<span>${item.label}</span>
      </button>`;
    if (item.children) {
      html += `<div class="nav-children ${parentActive ? "nav-children-open" : ""}">
        ${item.children.map((child) => `
          <button type="button" class="nav-subitem ${parentActive && state.activeFilter === child ? "nav-subitem-active" : ""}" data-nav="${item.id}" data-filter="${child}">
            ${child}
          </button>`).join("")}
      </div>`;
    }
    return html;
  }).join("");

  nav.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-nav");
      const filter = btn.getAttribute("data-filter");
      state.activeView = view;
      state.activeFilter = filter || "All";
      state.searchTerm = "";
      document.getElementById("globalSearch").value = "";
      state.sidebarOpen = false;
      document.body.classList.remove("sidebar-open");
      renderSidebar();
      renderMain();
    });
  });
}

/* -------------------------------------------------------------------------
   Main content rendering
   ------------------------------------------------------------------------- */
function renderMain() {
  document.getElementById("pageTitle").textContent =
    state.searchTerm ? "Search results" : VIEW_TITLES[state.activeView];

  if (state.searchTerm) {
    renderSearchResults(state.searchTerm);
    return;
  }

  if (state.activeView === "dashboard") {
    renderDashboard();
    return;
  }

  const ds = DATASETS[state.activeView];
  if (!ds) return;
  renderDatasetView(ds);
}

function renderFilterBar(container, categories) {
  if (!categories || categories.length <= 1) {
    container.innerHTML = "";
    container.hidden = true;
    return;
  }
  container.hidden = false;
  container.innerHTML = categories.map((cat) => `
    <button type="button" class="chip ${state.activeFilter === cat ? "chip-active" : ""}" data-filter="${escapeHtml(cat)}">
      ${escapeHtml(cat)}
    </button>`).join("");

  container.querySelectorAll("[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.activeFilter = chip.getAttribute("data-filter");
      renderSidebar();
      renderMain();
    });
  });
}

function renderDatasetView(ds) {
  const filterBar = document.getElementById("filterBar");
  const statsBar = document.getElementById("statsBar");
  statsBar.hidden = true;

  let items = ds.get();
  if (ds.filterKey) {
    const categories = ["All", ...Array.from(new Set(items.map((i) => i[ds.filterKey])))];
    renderFilterBar(filterBar, categories);
    if (state.activeFilter !== "All") {
      items = items.filter((i) => i[ds.filterKey] === state.activeFilter);
    }
  } else {
    renderFilterBar(filterBar, null);
  }

  renderResultsGrid(items, ds.render, ds.label);
}

function renderResultsGrid(items, renderFn, label) {
  const countEl = document.getElementById("resultCount");
  const grid = document.getElementById("contentGrid");
  const emptyEl = document.getElementById("emptyState");

  countEl.textContent = `${items.length} ${items.length === 1 ? "result" : "results"}`;

  if (items.length === 0) {
    grid.innerHTML = "";
    emptyEl.hidden = false;
    emptyEl.querySelector("p").textContent = `No ${label.toLowerCase()} match your search or filter.`;
    return;
  }
  emptyEl.hidden = true;
  grid.innerHTML = items.map(renderFn).join("");
}

function renderSearchResults(term) {
  document.getElementById("filterBar").hidden = true;
  document.getElementById("statsBar").hidden = true;
  const needle = term.toLowerCase();

  let sectionsHtml = "";
  let totalCount = 0;

  Object.values(DATASETS).forEach((ds) => {
    const items = ds.get().filter((item) =>
      ds.match(item).some((field) => String(field || "").toLowerCase().includes(needle))
    );
    if (items.length === 0) return;
    totalCount += items.length;
    sectionsHtml += `
      <section class="search-section">
        <h2 class="search-section-title">${ds.label} <span>(${items.length})</span></h2>
        <div class="card-grid">${items.map(ds.render).join("")}</div>
      </section>`;
  });

  document.getElementById("resultCount").textContent =
    `${totalCount} ${totalCount === 1 ? "result" : "results"} for "${term}"`;

  const grid = document.getElementById("contentGrid");
  const emptyEl = document.getElementById("emptyState");

  if (totalCount === 0) {
    grid.innerHTML = "";
    emptyEl.hidden = false;
    emptyEl.querySelector("p").textContent = `No records match "${term}". Try a different search term.`;
    return;
  }
  emptyEl.hidden = true;
  grid.innerHTML = `<div class="search-results">${sectionsHtml}</div>`;
}

function renderDashboard() {
  document.getElementById("filterBar").hidden = true;
  const statsBar = document.getElementById("statsBar");
  statsBar.hidden = false;

  const stats = [
    { label: "Servers", value: getServers().length, icon: "server" },
    { label: "Image Credentials", value: getCredentials().length, icon: "lock" },
    { label: "Configurations", value: getConfigurations().length, icon: "tool" }
  ];
  statsBar.innerHTML = stats.map((s) => `
    <div class="stat-card">
      <div class="stat-icon">${icon(s.icon)}</div>
      <div>
        <p class="stat-value">${s.value}</p>
        <p class="stat-label">${s.label}</p>
      </div>
    </div>`).join("");

  document.getElementById("resultCount").textContent = "Recently useful";
  document.getElementById("emptyState").hidden = true;

  // Build a mixed set of cards from every remaining category and interleave
  // them (round-robin) so the masonry layout below fills empty space with
  // a natural variety of card types, instead of one long run per category.
  const groups = [
    getServers().map(createServerCard),
    getCredentials().map(createCredentialCard),
    getConfigurations().map(createConfigurationCard)
  ];
  const maxLen = Math.max(...groups.map((g) => g.length));
  const interleaved = [];
  for (let i = 0; i < maxLen; i++) {
    groups.forEach((group) => {
      if (group[i]) interleaved.push(group[i]);
    });
  }

  document.getElementById("contentGrid").innerHTML =
    `<div class="masonry-grid">${interleaved.join("")}</div>`;
}

/* -------------------------------------------------------------------------
   Delegated interactions: copy command, show/copy password
   ------------------------------------------------------------------------- */
function setupContentInteractions() {
  document.getElementById("contentGrid").addEventListener("click", async (e) => {
    const copyCmdBtn = e.target.closest('[data-action="copy-command"]');
    if (copyCmdBtn) {
      const text = decodeURIComponent(copyCmdBtn.getAttribute("data-command"));
      const ok = await copyToClipboard(text);
      showToast(ok ? "Command copied to clipboard" : "Could not copy — copy manually");
      return;
    }

    const toggleBtn = e.target.closest('[data-action="toggle-password"]');
    if (toggleBtn) {
      const id = toggleBtn.getAttribute("data-cred-id");
      const valueEl = document.querySelector(`.password-value[data-cred-id="${CSS.escape(id)}"]`);
      const cred = getCredentials().find((c) => c.id === id);
      if (!valueEl || !cred) return;
      const revealed = valueEl.getAttribute("data-revealed") === "true";
      valueEl.textContent = revealed ? "••••••••••••" : cred.password;
      valueEl.setAttribute("data-revealed", String(!revealed));
      toggleBtn.innerHTML = icon(revealed ? "eye" : "eyeOff");
      return;
    }

    const copyPassBtn = e.target.closest('[data-action="copy-password"]');
    if (copyPassBtn) {
      const id = copyPassBtn.getAttribute("data-cred-id");
      const cred = getCredentials().find((c) => c.id === id);
      if (!cred) return;
      const ok = await copyToClipboard(cred.password);
      showToast(ok ? "Password copied to clipboard" : "Could not copy — copy manually");
      return;
    }
  });
}

/* -------------------------------------------------------------------------
   Global search
   ------------------------------------------------------------------------- */
function setupSearch() {
  const input = document.getElementById("globalSearch");
  const clearBtn = document.getElementById("searchClear");

  input.addEventListener("input", () => {
    state.searchTerm = input.value.trim();
    clearBtn.hidden = state.searchTerm.length === 0;
    renderMain();
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    state.searchTerm = "";
    clearBtn.hidden = true;
    input.focus();
    renderMain();
  });
}

/* -------------------------------------------------------------------------
   Mobile sidebar + misc chrome
   ------------------------------------------------------------------------- */
function setupChrome() {
  document.getElementById("menuToggle").addEventListener("click", () => {
    state.sidebarOpen = !state.sidebarOpen;
    document.body.classList.toggle("sidebar-open", state.sidebarOpen);
  });
  document.getElementById("sidebarOverlay").addEventListener("click", () => {
    state.sidebarOpen = false;
    document.body.classList.remove("sidebar-open");
  });
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("logoutBtn").addEventListener("click", handleLogout);
  document.getElementById("loginForm").addEventListener("submit", handleLoginSubmit);

  document.getElementById("currentYear").textContent = new Date().getFullYear();
}

/* -------------------------------------------------------------------------
   Init
   ------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupChrome();
  setupSearch();
  setupContentInteractions();

  const session = getSession();
  if (session) {
    const user = getUsers().find((u) => u.username === session.username) ||
      { username: session.username, role: session.role };
    enterApp(user);
  } else {
    document.getElementById("loginUsername").focus();
  }
});
