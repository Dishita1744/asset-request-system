<div align="center">

# Asset Request System


> A full-stack asset request and management system built with **Frappe Framework v15** (backend) and **Vue 3 + Vite** (frontend).

![Frappe v15](https://img.shields.io/badge/Frappe-v15-6A2CF6?)
![Vue 3](https://img.shields.io/badge/Vue-3-42B883?)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?)

</div>

**Quick Setup Links:** [macOS Setup](#macos-setup) | [Windows Setup](#windows-setup) | [Troubleshooting](#troubleshooting)

## What we cover

- [Tech Stack](#-tech-stack)
- [What's in This Repo](#-whats-in-this-repo)
- [Prerequisites](#-prerequisites)
- [macOS Setup](#macos-setup)
- [Windows Setup](#windows-setup)
- [Linux Setup](#-linux-setup)
- [Project URLs](#-project-urls)
- [Login Credentials](#-login-credentials)
- [Optional - Load Sample Data](#-optional--load-sample-data)
- [Troubleshooting](#troubleshooting)
- [Notes](#-notes)

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Frappe Framework v15, Python 3.11 |
| Frontend | Vue 3, Vite, Tailwind CSS |
| Database | MariaDB |
| Cache / Queue | Redis |
| Package Manager | Yarn |

---

## 🗂️ What's in This Repo

This repo contains **only the custom Frappe app** — not the full bench. The app lives at:

```
apps/assetmanager/
├── assetmanager/          # Python backend (DocTypes, hooks, seed)
└── frontend/              # Vue 3 frontend (Vite + Tailwind)
```

You'll need to create a **fresh Frappe bench** and place this app inside it. The steps below walk you through that from scratch.

---

## ✅ Prerequisites

Before starting, make sure the following are available on your system:

- **Python 3.11** (recommended over 3.12)
- **Node.js 18 or 20**
- **Yarn**
- **MariaDB**
- **Redis**
- **wkhtmltopdf**
- **Git**

---

> NOTE: You can replace the "~" with your desired folder path

<a id="macos-setup"></a>
## macOS Setup

### Step 1 — Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow any instructions it prints about adding Homebrew to your PATH.

### Step 2 — Install System Dependencies

```bash
brew install python@3.11 node mariadb redis wkhtmltopdf git
npm install -g yarn
```

### Step 3 — Install bench CLI

```bash
pip3 install --user frappe-bench
```

If `bench` command is not found after install:

```bash
echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Step 4 — Start Services

```bash
brew services start mariadb
brew services start redis
```

Verify Redis is running:

```bash
redis-cli ping   # Expected: PONG
```

### Step 5 — Set MariaDB Root Password

```bash
mysql -u root
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
EXIT;
```

### Step 6 — Create a Fresh Bench

```bash
cd ~
bench init my-bench --frappe-branch version-15
cd my-bench
```

> ⏳ This downloads Frappe and sets up the Python environment. It takes a few minutes.

### Step 7 — Clone and Copy the App

```bash
cd ~
git clone https://github.com/Dishita1744/asset-request-system.git
cp -r ~/asset-request-system/apps/assetmanager ~/my-bench/apps/assetmanager
```

### Step 8 — Install the App Package

```bash
cd ~/my-bench
./env/bin/pip install -e apps/assetmanager
```

### Step 9 — Create a Site

```bash
bench new-site mysite.localhost --mariadb-root-password root --admin-password admin123
bench use mysite.localhost
```

### Step 10 — Install App and Migrate

```bash
bench --site mysite.localhost install-app assetmanager
bench --site mysite.localhost migrate
```

### Step 11 — Configure Dev Settings

```bash
bench --site mysite.localhost set-config developer_mode 1
bench --site mysite.localhost set-config cors_allowed_origins "http://localhost:5173"
bench --site mysite.localhost clear-cache
```

### Step 12 — Set Up Vue Frontend

```bash
cd ~/my-bench/apps/assetmanager/frontend
yarn install
cp .env.example .env
```

Open `.env` and confirm:

```env
VITE_BACKEND_URL=http://localhost:8000
```

### Step 13 — Run Everything

Open **two terminals**:

**Terminal 1** — Frappe backend:

```bash
cd ~/my-bench
bench start
```

**Terminal 2** — Vue frontend:

```bash
cd ~/my-bench/apps/assetmanager/frontend
yarn dev --port 5173
```

---

<a id="windows-setup"></a>
## Windows Setup

> ⚠️ Frappe does **not** run natively on Windows. You must use **WSL 2 (Windows Subsystem for Linux)**.

### Step 1 — Enable WSL 2

Open **PowerShell as Administrator**:

```powershell
wsl --install
```

Restart your PC when prompted. Then open **Ubuntu** from the Start Menu and complete the setup.

### Step 2 — Update Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 3 — Install System Dependencies

```bash
sudo apt install -y python3 python3-pip python3-venv python3-dev   mariadb-server mariadb-client redis-server   git curl wkhtmltopdf npm
```

Install Node 18+ and Yarn:

```bash
sudo npm install -g yarn n
sudo n 18
```

Close and reopen the terminal, then verify:

```bash
node --version   # should be v18.x or v20.x
```

### Step 4 — Install bench CLI

Modern Ubuntu blocks global `pip` installs. Use `pipx` instead:

```bash
sudo apt install -y pipx
pipx ensurepath
source ~/.bashrc
pipx install frappe-bench
```

### Step 5 — Start Services

```bash
sudo service mariadb start
sudo service redis-server start
```

### Step 6 — Set MariaDB Root Password

```bash
sudo mysql -u root
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
EXIT;
```

### Step 7 — Create a Fresh Bench

```bash
cd ~
bench init my-bench --frappe-branch version-15
cd my-bench
```

### Step 8 — Clone and Copy the App

```bash
cd ~
git clone https://github.com/Dishita1744/asset-request-system.git
cp -r ~/asset-request-system/apps/assetmanager ~/my-bench/apps/assetmanager
```

### Step 9 — Install the App Package

```bash
cd ~/my-bench
./env/bin/pip install -e apps/assetmanager
```

### Step 10 — Create a Site

```bash
bench new-site mysite.localhost --mariadb-root-password root --admin-password admin123
bench use mysite.localhost
```

### Step 11 — Install App and Migrate

```bash
bench --site mysite.localhost install-app assetmanager
bench --site mysite.localhost migrate
```

### Step 12 — Configure Dev Settings

```bash
bench --site mysite.localhost set-config developer_mode 1
bench --site mysite.localhost set-config cors_allowed_origins "http://localhost:5173"
bench --site mysite.localhost clear-cache
```

### Step 13 — Set Up Vue Frontend

```bash
cd ~/my-bench/apps/assetmanager/frontend
yarn install
cp .env.example .env
```

Confirm `.env` contains:

```env
VITE_BACKEND_URL=http://localhost:8000
```

### Step 14 — Run Everything

**WSL Terminal 1** — Frappe backend:

```bash
cd ~/my-bench
bench start
```

**WSL Terminal 2** — Vue frontend:

```bash
cd ~/my-bench/apps/assetmanager/frontend
yarn dev --port 5173
```

---

## 🐧 Linux Setup

Follow the exact same steps as the **Windows WSL** section above, but run them directly in your Linux terminal — no WSL needed.

---

## 🌐 Project URLs

Once both servers are running, open these in your browser:

| What | URL |
|---|---|
| Vue Frontend | `http://127.0.0.1:5173` |
| Frappe Desk (Admin) | `http://127.0.0.1:8000/app` |
| Frappe Backend | `http://127.0.0.1:8000` |

---

## 🔐 Login Credentials

| Role | Username | Password |
|---|---|---|
| Administrator | `Administrator` | `admin123` |

### Creating a Regular User for Testing

1. Open Frappe Desk → `http://127.0.0.1:8000/app`
2. Search for **User** in the search bar
3. Click **New**
4. Fill in name and email
5. Set a password under **Set Password**
6. Assign the **Employee** role
7. Save — then log in from the Vue frontend using that user

---

## 🌱 Optional — Load Sample Data

If you want pre-loaded assets and requests for testing:

```bash
bench --site mysite.localhost execute assetmanager.assetmanager.seed.seed_data
```

---

<a id="troubleshooting"></a>
## Troubleshooting

### `externally-managed-environment` error when installing bench

Ubuntu 23+ blocks global pip installs. Use pipx:

```bash
sudo apt install -y pipx
pipx ensurepath
source ~/.bashrc
pipx install frappe-bench
```

---

### `bench` command not found after install

```bash
pipx ensurepath
source ~/.bashrc
```

If still not found, restart your terminal completely.

---

### `bench new-site` fails — connection refused or access denied

MariaDB is not running or the root password is wrong. Run:

```bash
# macOS
brew services restart mariadb

# Ubuntu/WSL
sudo service mariadb restart
```

Then retry the `ALTER USER` SQL step.

---

### `127.0.0.1 does not exist` when opening Frappe

The default site is not set. Run:

```bash
bench use mysite.localhost
bench start
```

---

### Vue frontend shows CORS error

Make sure you ran the CORS config step:

```bash
bench --site mysite.localhost set-config cors_allowed_origins "http://localhost:5173"
bench --site mysite.localhost clear-cache
```

Then restart `bench start`.

---

### Redis or MariaDB errors during `bench start`

Services stopped. Restart them:

```bash
# macOS
brew services start mariadb
brew services start redis

# Ubuntu/WSL
sudo service mariadb start
sudo service redis-server start
```

---

### `yarn install` fails or frontend won't start

Check your Node version:

```bash
node -v   # Must be v18 or v20
```

If wrong version, run:

```bash
sudo n 18   # WSL/Linux
```

Or on macOS:

```bash
brew install node@18
```

---

### `bench start` runs on a different port

Check the terminal output for the actual port. If needed, edit `Procfile` in the bench root:

```
web: bench serve --port 8000
```

Then restart bench.

---

## 📝 Notes

- The backend (Frappe) and frontend (Vue) run as **two separate servers**
- The Vue app communicates with Frappe via REST API using the URL in `.env`
- Developer mode enables hot reload and bypasses some Frappe caching
- For production deployment, build the frontend with `yarn build` and serve through Nginx

---

## Author

Dishita Somaiya
