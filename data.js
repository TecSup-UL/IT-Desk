/* ==========================================================================
   data.js
   --------------------------------------------------------------------------
   All information shown on the dashboard lives in the plain arrays below.
   To add a new record, add a new object to the matching array — the
   dashboard will pick it up automatically, no other code needs to change.

   Every value here is FAKE / EXAMPLE data for demonstration purposes.
   Replace it with your own organization's information before real use.

   The getX() functions at the bottom are the only thing the rest of the
   app talks to. Today they just return the arrays below, but later you
   can rewrite the inside of a getX() function to call a REST API, Firebase,
   a database, etc. — nothing else in the app needs to change.
   ========================================================================== */

/* ---------- Users (prototype login only — see auth.js) ---------- */
const users = [
  { username: "admin", password: "1234", role: "Administrator" },
  { username: "intern", password: "intern123", role: "Internship" }
];

/* ---------- Servers & network ---------- */
const servers = [
  {
    id: "srv-01",
    name: "Printer Server",
    hostname: "\\\\ulkb11pr01",
    username: "<StaffID>",
    password: "<password>",
    description: "This server is used to find drivers for printers to install and test functionality."
  },
  {
    id: "srv-02",
    name: "Package Server",
    hostname: "\\\\ulcakpkgadm00",
    username: "<StaffID>",
    password: "<password>",
    description: "This server is used to find and get the software packages."
  },
  {
    id: "srv-03",
    name: "Image Server",
    hostname: "\\\\tecsup",
    username: "admin",
    password: "1234",
    description: "This server is used to backup and restore the images for the laptops and desktops."
  }
];

/* ---------- Credentials ---------- */
const credentials = [
  {
    id: "cred-01",
    device: "HP 440 G5 Tiny",
    category: "Laptop",
    username: ".\\admin",
    password: "ulWin11@440g5",
    notes: `Platform: Windows 11 Tiny Enterprise \nApps:
    - 7-Zip \t- Adobe Reader
    - Cortex \t- Cisco Secure Client
    - Java 7 \t- MSOffice 365
    - PDF 24 \t- Omnissa Horizon Client
    - Chrome`
  },
  {
    id: "cred-02",
    device: "HP 440 G6 Regular (MSO 2024)",
    category: "Laptop",
    username: ".\\admin",
    password: "ulWin11@440g6",
    notes: `Platform: Windows 11 Enterprise \nApps:
    - 7-Zip \t- Adobe Reader
    - Cortex \t- Cisco Secure Client
    - Java 7 \t- MSOffice 2024
    - PDF 24 \t- Omnissa Horizon Client
    - Chrome`
  },
  {
    id: "cred-03",
    device: "HP 440 G6 Regular (0365)",
    category: "Laptop",
    username: ".\\admin",
    password: "ulWin11@440g6",
    notes: `Platform: Windows 11 Enterprise \nApps:
    - 7-Zip \t- Adobe Reader
    - Cortex \t- Cisco Secure Client
    - Java 7 \t- MSOffice 365
    - PDF 24 \t- Omnissa Horizon Client
    - Chrome`
  },
  {
    id: "cred-04",
    device: "HP 450 G8 Regular",
    category: "Laptop",
    username: ".\\admin",
    password: "ulWin11@450g8",
    notes: `Platform: Windows 11 Enterprise \nApps:
    - 7-Zip \t- Adobe Reader
    - Cortex \t- Cisco Secure Client
    - Java 7 \t- MSOffice 365
    - PDF 24 \t- Omnissa Horizon Client
    - Chrome`
  },
  {
    id: "cred-05",
    device: "HP 450 G8 Tiny",
    category: "Laptop",
    username: ".\\admin",
    password: "ulWin11@450g8",
    notes: `Platform: Windows 11 Tiny Enterprise \nApps:
    - 7-Zip \t- Adobe Reader
    - Cortex \t- Cisco Secure Client
    - Java 7 \t- MSOffice 365
    - PDF 24 \t- Omnissa Horizon Client
    - Chrome`
  },
  {
    id: "cred-06",
    device: "HP 450 G8 (No Cortex)",
    category: "Laptop",
    username: "admin",
    password: "Airbus@123",
    notes: `Platform: Windows 11 Enterprise \nApps:
    - 7-Zip \t- Adobe Reader
    - Java 7 \t- MSOffice 2024
    - PDF 24 \t- Omnissa Horizon Client
    - Chrome`
  },
  {
    id: "cred-07",
    device: "HP 800 G2 - KIOSK",
    category: "KIOSK Desktop",
    username: "admin",
    password: "ulWin11@800g2",
    notes: `Platform: Windows 11 Enterprise \nApps:
    - Cortex \t- Omnissa Horizon Client`
  },
  {
    id: "cred-08",
    device: "HP PCs",
    category: "BIOS",
    username: "-",
    password: "hpe.dms6",
    notes: `Sometimes the BIOS password is set to a default value for some HP devices.`
  },
  {
    id: "cred-09",
    device: "e-Studio Printers",
    category: "Printer",
    username: "admin",
    password: "123456",
    notes: `e-Studio printers have a default password for the admin account. This password is used to access the printer's administrative-level settings for configuration and management.`
  },
  {
    id: "cred-10",
    device: "TecSup PCs",
    category: "Desktop",
    username: "admin",
    password: "1234",
    notes: `This credential is used for the Image Server and a dedicated PC used for external HDD/SSD recovery and other purposes.`
  },
  
];

/* ---------- Configuration guides ----------
   Each step is an object: { text } or { text, command }.
   The "command" field is optional — only add it to a step when there is
   an actual command line to run for that step. Steps without a command
   just show as plain instruction text. */
const configurations = [
  {
    id: "cfg-01",
    title: "Recovering an Image to a Laptop",
    category: "Image Recovery",
    steps: [
        { text: "Check that Secure Boot is disabled in BIOS." },
        { text: "Press F10 → Advanced / Boot Options → Disable Secure Boot → Press F10 to save." },
        { text: "Connect the Ventoy USB and press F9 during startup to open the Boot Menu." },
        { text: "Select the Kingston USB drive from the boot list." },
        { text: "Select Acronis → Boot in Normal Mode → Acronis True Image." },
        { text: "Select Recover → Browse and enter the required network path." },
        { text: "Enter the required network credentials when prompted. \nUserName: admin \nPassword: 1234" },
        { text: "Select the E: partition → Win 11 – 2026 → Select the required laptop image.",
          command: "\\\\tecsup\\E\\Win 11 - 2026\\HP 440 G5 Tiny.tibx"
        },
        { text: "Click OK → Next → Next." },
        { text: "Select the required green-marked date → Select the available time → Next." },
        { text: "Select Disk 1 → Next." },
        { text: "Select the target storage device → Next → OK → Proceed." },
        { text: "Select Restart the computer and allow the recovery process to complete." }
    ]
},
  {
    id: "cfg-02",
    title: "KIOSK Setup Configuration",
    category: "KIOSK PC",
    steps: [
      { text: "Recover the KIOSK image to the laptop/desktop using Ventoy + Acronis with the RJ45 switch cable connected." },
      { text: "Wait for the image booting process to finish. The BIOS update will start automatically." },
      { text: "When the Windows login screen appears, press Ctrl + Alt + Delete and log in using the device password." },
      { text: "Remove the switch cable and connect the network cable." },
      { text: "After login, the screen may be black with Command Prompt open." },
      { text: "Press Ctrl + Shift + Esc to open Task Manager." },
      { text: "Select Run new task, type explorer, and press Enter." },
      { text: "Go to Settings → System → About → Domain or Workgroup." },
      { text: "Open the Computer Name tab and click Change." },
      { text: "Enter the required computer name, such as IT00..... or ULKB......." },
      {
        text: "Select Domain and enter the required domain name.",
        command: "srilankan.corp"
      },
      { text: "Click OK and wait for the credential window to appear." },
      { text: `Enter your authorized credentials: \nUsername: ul\\<StaffNo> \nPassword: <Your Password>`},
      { text: "After the success message appears, click OK on all windows and select Restart Now." },
      { text: "After restarting, repeat Steps 3–6." },
      { text: "Open File Explorer → C: → Apps → KIOSK." },
      { text: "Find the Tweak configuration file." },
      { text: "Double-click Tweak and click Yes twice." },
      { text: "Press Windows + L to lock the device, then press Ctrl + Alt + Delete." },
      { text: "Log in with the KIOSK user. The device should automatically open the Omnissa Horizon Client home page." },
    ]
  },
  {
    id: "cfg-03",
    title: "Regular PC Configuration",
    category: "Regular PC",
    steps: [
        { text: "Boot the laptop/desktop with Windows 11 Enterprise or Windows 11 Tiny Enterprise using a Ventoy USB." },
        { text: "Use \"admin\" as the username during Windows setup." },
        { text: "After Windows boots, connect the Dongle and install all Windows updates." },
        { text: "Install the required applications: \n\t- 7-Zip \n\t- Adobe Reader \n\t- Chrome \n\t- Omnissa Horizon Client \n\t- Java 7 \n\t- MS Office 2024 / 365 \n\t- PDF24 \n\t- Cisco Secure Client \n\t- Cortex." },
        { text: "Open Windows + X → Computer Management → Local Users and Groups → Users → Right-click \"admin\" → Set Password → Proceed." },
        { text: "Set the admin password using the format: \nul<OS Platform>@<Laptop Model>. \nExample: ulWin11@440g5." },
        { text: "Click \"OK\" to confirm the new password." },
        { text: "Open Settings → System → About → Advanced System Settings." },
        { text: "Open the Remote tab → Remote Desktop → Select \"Allow remote connections to this computer\"." },
        { text: "Open Advanced → Environment Variables → System Variables → New." },
        { text: "Enter Variable Name: \"Windows\" and Variable Value: \"11 <OS Version>\"." },
        { text: "Click \"Apply\"." },
        { text: "Open the Computer Name tab → Change → Enter IT00 or ULKB based on the device number." },
        { text: "Click \"OK\", confirm the success message, close all windows, and select \"Restart Now\"." }
    ]
  },
  {
    id: "cfg-04",
    title: "MS Teams Setup for Court Sessions",
    category: "MS Teams",
    steps: [
        { text: "Open Microsoft Teams." },
        { text: "Go to the Calendar option." },
        { text: "Select \"New\" and enter a suitable title for the meeting." },
        { text: "Turn on the \"Teams meeting\" option." },
        { text: "Select the required date and time for the meeting." },
        { text: "Add the required attendees." },
        { text: "Click the \"Options\" button that appears after enabling the Teams meeting option." },
        { text: "Under \"Who can bypass the lobby?\", select \"Everyone\"." },
        { text: "Under \"Recording and transcription\", select \"Record and transcribe\"." },
        { text: "Click \"Save\" to create the meeting." },
        { text: "Go back to the Calendar and double-click the meeting card you created." },
        { text: "The meeting details and credentials will be displayed." }
    ]
},
];

/* ==========================================================================
   Accessor functions
   The rest of the app should ALWAYS go through these, never touch the
   arrays above directly. Swap the body of any function below to fetch
   from an API/database later without touching UI code.
   ========================================================================== */
function getUsers() { return users; }
function getServers() { return servers; }
function getCredentials() { return credentials; }
function getConfigurations() { return configurations; }
