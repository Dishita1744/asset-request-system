# Frappe Framework Assessment

A full-stack asset request and management system built with **Frappe Framework v15** for the backend and **Vue 3 + Vite** for the frontend.

This repository currently contains a **bench-style project structure**. That means it includes folders like `apps/`, `sites/`, `config/`, `logs/`, and `env/`. For testing and assessment purposes, the safest way to run this project is to **create a fresh Frappe bench** and then copy the custom app from this repository into that fresh bench, instead of trying to run the cloned bench directly.

---

## Important Note

This repository is **not structured like a standard Frappe app repository**.

Normally, only the custom app should be uploaded to GitHub. However, since this repository contains the whole bench-style structure, follow the setup steps below exactly.

---

## What You Actually Need From This Repo

The main custom app used in this project is:

```bash
apps/assetmanager
```

This contains:

- Frappe backend code
- DocTypes
- Hooks
- Business logic
- Vue frontend in `apps/assetmanager/frontend`

---

# Setup Overview

The recommended way to run this project is:

1. Install system dependencies
2. Install `bench`
3. Create a **fresh new bench**
4. Copy `apps/assetmanager` from this repo into the new bench
5. Install the app
6. Create a Frappe site
7. Run backend and frontend separately

---

# Prerequisites

Make sure the following are installed before starting:

- Python 3.11 preferred
- Node.js 18 or 20
- Yarn
- MariaDB
- Redis
- wkhtmltopdf
- Git

> Python 3.12 may work, but some Frappe/Bench environments can be more reliable on Python 3.11.

---

# macOS Setup

## 1. Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 2. Install required packages

```bash
brew install python@3.11 node mariadb redis wkhtmltopdf git
npm install -g yarn
pip3 install --user frappe-bench
```

If `bench` is not found after install:

```bash
echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## 3. Start services

```bash
brew services start mariadb
brew services start redis
```

## 4. Set MariaDB root password

```bash
mysql -u root
```

Run:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
EXIT;
```

## 5. Create a fresh bench

```bash
cd ~
bench init my-bench --frappe-branch version-15
```

## 6. Copy the app from this repository

If your cloned repository is at `/path/to/asset-request-system`, run:

```bash
cp -r /path/to/asset-request-system/apps/assetmanager ~/my-bench/apps/assetmanager
```

## 7. Install the app package

```bash
cd ~/my-bench
./env/bin/pip install -e apps/assetmanager
```

## 8. Create a new site

```bash
bench new-site mysite.localhost --mariadb-root-password root --admin-password admin123
```

## 9. Set the default site

```bash
bench use mysite.localhost
```

## 10. Install the app on the site

```bash
bench --site mysite.localhost install-app assetmanager
bench --site mysite.localhost migrate
```

## 11. Configure development settings

```bash
bench --site mysite.localhost set-config developer_mode 1
bench --site mysite.localhost set-config cors_allowed_origins "http://localhost:5173"
bench --site mysite.localhost clear-cache
```

## 12. Frontend setup

```bash
cd ~/my-bench/apps/assetmanager/frontend
yarn install
cp .env.example .env
```

Set this in `.env`:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## 13. Run backend and frontend

Terminal 1:

```bash
cd ~/my-bench
bench start
```

Terminal 2:

```bash
cd ~/my-bench/apps/assetmanager/frontend
yarn dev --port 5173
```

---

# Windows Setup

## Important

Frappe does **not run natively on Windows**. Use **WSL2 with Ubuntu**.

## 1. Install WSL2

Run PowerShell as Administrator:

```powershell
wsl --install
```

Restart if prompted, then open Ubuntu.

## 2. Install dependencies inside Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv python3-dev \
  mariadb-server mariadb-client redis-server git curl wkhtmltopdf
sudo apt install -y npm
sudo npm install -g yarn n
sudo n 18
```

Restart terminal after Node install.

## 3. Install bench

Modern Ubuntu may block global `pip` installs due to externally managed Python environments. If that happens, use `pipx`:

```bash
sudo apt install -y pipx
pipx ensurepath
source ~/.bashrc
pipx install frappe-bench
```

## 4. Start MariaDB and Redis

```bash
sudo service mariadb start
sudo service redis-server start
```

## 5. Set MariaDB root password

```bash
sudo mysql -u root
```

Run:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
EXIT;
```

## 6. Create a fresh bench

```bash
cd ~
bench init my-bench --frappe-branch version-15
```

## 7. Copy the app from this repository

If your repo is cloned at `/path/to/asset-request-system`, run:

```bash
cp -r /path/to/asset-request-system/apps/assetmanager ~/my-bench/apps/assetmanager
```

## 8. Install the app package

```bash
cd ~/my-bench
./env/bin/pip install -e apps/assetmanager
```

## 9. Create a new site

```bash
bench new-site mysite.localhost --mariadb-root-password root --admin-password admin123
```

## 10. Set the default site

```bash
bench use mysite.localhost
```

## 11. Install app and migrate

```bash
bench --site mysite.localhost install-app assetmanager
bench --site mysite.localhost migrate
```

## 12. Configure development settings

```bash
bench --site mysite.localhost set-config developer_mode 1
bench --site mysite.localhost set-config cors_allowed_origins "http://localhost:5173"
bench --site mysite.localhost clear-cache
```

## 13. Frontend setup

```bash
cd ~/my-bench/apps/assetmanager/frontend
yarn install
cp .env.example .env
```

Set:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## 14. Run backend and frontend

Terminal 1:

```bash
cd ~/my-bench
bench start
```

Terminal 2:

```bash
cd ~/my-bench/apps/assetmanager/frontend
yarn dev --port 5173
```

Then open:

- Backend / Frappe Desk: `http://127.0.0.1:8000`
- Frontend / Vue App: `http://127.0.0.1:5173`

---

# Linux Setup

For Ubuntu/Linux, follow the same steps as the Windows WSL section, but run them on your Linux machine directly.

---

# Login Credentials

## Admin login

- Username: `Administrator`
- Password: `admin123`

## Regular user testing

Create a normal Frappe user from the backend:

1. Open Frappe Desk
2. Go to **User**
3. Create a new user
4. Assign the appropriate role
5. Log in from the frontend using that user

---

# Optional Sample Data

If the project includes a seed function, run:

```bash
bench --site mysite.localhost execute assetmanager.seed.seed_data
```

---

# Troubleshooting

## 1. `externally-managed-environment` while installing bench

Use `pipx` instead of `pip install`:

```bash
sudo apt install -y pipx
pipx ensurepath
source ~/.bashrc
pipx install frappe-bench
```

---

## 2. `WARN: Command not being executed in bench directory` or `No such command 'new-site'`

This usually happens when trying to run commands inside a cloned bench snapshot instead of a properly initialized bench.

### Solution:
Do **not** run the project directly from this cloned repository.

Instead:

1. Create a fresh bench with `bench init`
2. Copy only `apps/assetmanager`
3. Continue setup inside the fresh bench

---

## 3. `Permission denied` during `bench init`

Example:

```bash
PermissionError: [Errno 13] Permission denied: 'my-bench'
```

### Fix:
Create the bench inside your home directory:

```bash
cd ~
bench init my-bench --frappe-branch version-15
```

Do not create it in a protected folder unless you own that folder.

---

## 4. Frappe opens but shows `127.0.0.1 does not exist`

This means the default site is not selected. Frappe supports setting a current site using `bench use`. [web:52]

### Fix:

```bash
bench use mysite.localhost
```

Then restart:

```bash
bench start
```

---

## 5. Backend runs on the wrong port

Sometimes `bench start` may serve on a different port depending on the bench configuration or `Procfile`.

Check the terminal output for the actual port, then either:

- use that port, or
- edit `Procfile` and set:

```txt
web: bench serve --port 8000
```

Then restart bench.

---

## 6. Vue frontend cannot reach backend

Check:

- backend is running
- `.env` contains correct backend URL
- CORS is configured

Example:

```env
VITE_BACKEND_URL=http://localhost:8000
```

And run:

```bash
bench --site mysite.localhost set-config cors_allowed_origins "http://localhost:5173"
bench --site mysite.localhost clear-cache
```

---

## 7. Redis or MariaDB errors during `bench start`

Start the services first.

### macOS:

```bash
brew services start mariadb
brew services start redis
```

### Ubuntu/WSL:

```bash
sudo service mariadb start
sudo service redis-server start
```

---

## 8. `bench` command not found

If installed with `pipx`, ensure path is loaded:

```bash
pipx ensurepath
source ~/.bashrc
```

If needed, reopen terminal.

---

## 9. `yarn install` or frontend build issues

Check versions:

```bash
node -v
yarn -v
```

Use Node 18 or 20.

---

# Notes for Assessment Review

- This project contains both backend and frontend code.
- Backend runs through Frappe bench.
- Frontend runs separately through Vite.
- For real-world GitHub usage, this repo should ideally contain only the custom Frappe app, not the full bench structure.
- For assessment/testing, the setup above is the safest and most reproducible method.

---

# Project URLs

When everything is running:

- Frappe backend: `http://127.0.0.1:8000`
- Frappe Desk: `http://127.0.0.1:8000/app`
- Vue frontend: `http://127.0.0.1:5173`

