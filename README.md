# 🗂️ Office Asset Request System

A full-stack asset management application built with **Frappe Framework** (Python backend) and **Vue 3** (frontend). It allows employees to browse available office assets and submit requests, while administrators can review, approve, or reject those requests and manage asset inventory.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup (Frappe / bench)](#backend-setup-frappe--bench)
- [Frontend Setup (Vue 3 / Vite)](#frontend-setup-vue-3--vite)
- [Running Both Servers](#running-both-servers)
- [Login Credentials](#login-credentials)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
my-bench/
├── apps/
│   ├── frappe/           ← Frappe core framework (Python)
│   └── assetmanager/     ← Custom Frappe app (Python backend)
│       ├── assetmanager/ ← Python package (DocTypes, hooks, API)
│       └── frontend/     ← Vue 3 SPA (Vite, frappe-ui, TailwindCSS)
├── env/                  ← Python virtual environment
├── sites/
│   └── mysite.localhost/ ← Frappe site (DB config, uploads)
├── config/               ← Redis & process configs
└── Procfile              ← Honcho/foreman process definitions
```

| Layer | Technology | Port |
|---|---|---|
| Backend API | Frappe (Python / Gunicorn) | `8000` |
| Frontend Dev Server | Vite (Vue 3) | `5173` |
| Database | MariaDB | `3306` |
| Cache / Queue | Redis | `13000` / `11000` |

---

## ✅ Prerequisites

Make sure the following are installed on your machine before proceeding.

### System Requirements

| Tool | Version | Install |
|---|---|---|
| **Python** | ≥ 3.10 | [python.org](https://www.python.org/downloads/) |
| **Node.js** | ≥ 18 LTS | [nodejs.org](https://nodejs.org/) |
| **npm** or **yarn** | latest | bundled with Node / [yarnpkg.com](https://yarnpkg.com/) |
| **MariaDB** | ≥ 10.6 | `brew install mariadb` (macOS) |
| **Redis** | ≥ 6 | `brew install redis` (macOS) |
| **bench CLI** | latest | See below |
| **wkhtmltopdf** | ≥ 0.12 | `brew install wkhtmltopdf` (macOS) |

### Install bench CLI

```bash
pip install frappe-bench
```

> **Note:** It is recommended to use a dedicated Python virtualenv or pyenv for bench.

---

## 📁 Project Structure

```
apps/assetmanager/
├── assetmanager/
│   ├── asset_manager/
│   │   └── doctype/
│   │       ├── asset_request/   ← Asset Request DocType
│   │       └── office_asset/    ← Office Asset DocType
│   ├── hooks.py                 ← App hooks & event bindings
│   └── seed.py                  ← Sample data seeder
└── frontend/
    ├── src/
    │   ├── components/          ← Reusable Vue components
    │   ├── pages/               ← Route-level page components
    │   ├── router/              ← Vue Router config
    │   ├── data/                ← Frappe resource definitions
    │   └── utils/               ← Helper utilities
    ├── vite.config.js           ← Vite + proxy config
    ├── tailwind.config.js       ← TailwindCSS config
    └── package.json
```

---

## 🐍 Backend Setup (Frappe / bench)

### 1. Clone / Navigate to the bench directory

If starting fresh, initialize a new bench (skip if you already have `my-bench`):

```bash
# Install bench if not already installed
pip install frappe-bench

# Initialize a new bench (skip if cloning an existing bench)
bench init my-bench --frappe-branch version-15
cd my-bench
```

If you **cloned this repository**, navigate into it:

```bash
cd my-bench
```

### 2. Set up the Python virtual environment

```bash
# Create a virtual environment (bench does this automatically on init)
# If the env/ folder is missing, recreate it:
python3 -m venv env

# Activate it
source env/bin/activate      # macOS / Linux
# env\Scripts\activate       # Windows
```

### 3. Install Python dependencies

Bench manages Python dependencies via pip inside the virtualenv. Install all app dependencies:

```bash
# Install all Frappe & app Python packages
./env/bin/pip install -e apps/frappe
./env/bin/pip install -e apps/assetmanager
```

Or if bench is on your PATH and the venv is active:

```bash
cd apps/frappe && pip install -e . && cd ../..
cd apps/assetmanager && pip install -e . && cd ../..
```

### 4. Set up MariaDB

Ensure MariaDB is running and accessible:

```bash
# macOS (Homebrew)
brew services start mariadb

# Verify connection
mysql -u root -e "SELECT VERSION();"
```

Configure MariaDB for Frappe (run once):

```sql
-- In MySQL shell
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_root_password';
-- or on some systems:
UPDATE mysql.user SET plugin='mysql_native_password' WHERE User='root';
FLUSH PRIVILEGES;
```

### 5. Create the Frappe site

```bash
bench new-site mysite.localhost \
  --mariadb-root-password YOUR_MARIADB_ROOT_PASSWORD \
  --admin-password admin
```

> This creates the site at `sites/mysite.localhost/` and sets up the database.

### 6. Install the assetmanager app onto the site

```bash
bench --site mysite.localhost install-app assetmanager
```

### 7. Run database migrations

```bash
bench --site mysite.localhost migrate
```

### 8. Enable Developer Mode

```bash
bench --site mysite.localhost set-config developer_mode 1
bench --site mysite.localhost clear-cache
```

### 9. Configure CORS (for the Vue frontend)

```bash
bench --site mysite.localhost set-config allow_cors "*"
bench --site mysite.localhost set-config cors_allowed_origins "http://localhost:5173"
bench --site mysite.localhost set-config cors_headers "Authorization, Content-Type, X-Frappe-Site-Name, X-Frappe-CSRF-Token"
```

### 10. (Optional) Seed sample data

```bash
bench --site mysite.localhost execute assetmanager.seed.seed_data
```

---

## 🖼️ Frontend Setup (Vue 3 / Vite)

### 1. Navigate to the frontend directory

```bash
cd apps/assetmanager/frontend
```

### 2. Install Node.js dependencies

Using **npm**:

```bash
npm install
```

Using **yarn** (recommended, as `yarn.lock` is committed):

```bash
yarn install
```

### 3. Configure environment variables

```bash
# Copy the example env file
cp .env.example .env
```

Open `.env` and set the backend URL:

```env
VITE_BACKEND_URL=http://localhost:8000
```

> The default value already points to the local Frappe dev server. Change it if your backend runs on a different port.

---

## 🚀 Running Both Servers

Start everything with just **two commands** in two separate terminal windows:

**Terminal 1 — Backend** (from the project root):
```bash
bench start
```

**Terminal 2 — Frontend** (from the frontend folder):
```bash
cd apps/assetmanager/frontend
yarn dev
```

| | URL |
|---|---|
| Frappe Backend | http://localhost:8000 |
| Vue Frontend | http://localhost:5173 |

---

## 🔐 Login Credentials

### Frappe Admin Panel

Access the Frappe backend admin interface at: **http://localhost:8000**

| Role | Username | Password |
|---|---|---|
| **System Administrator** | `Administrator` | `admin123` |

> The Administrator account has full access to DocTypes, settings, user management, and all records.

### Vue Frontend Application

Access the Vue SPA at: **http://localhost:5173**

| Role | Username | Password |
|---|---|---|
| **Admin / Manager** | `Administrator` | `admin123` |
| **Regular Employee** | *(any Frappe user you create)* | *(password set on creation)* |

To create a new employee user:
1. Log in to **http://localhost:8000** as `Administrator`
2. Go to **Home → Users → New User**
3. Fill in email, first name, and set a password
4. Assign the role **Employee** (or **Asset Manager** if you have custom roles)

---

## 🌐 API Reference

The Vue frontend communicates with Frappe via its REST API. All requests are proxied through Vite (port `5173` → `8000`) so no CORS issues during development.

| Endpoint | Method | Description |
|---|---|---|
| `/api/method/login` | `POST` | Authenticate and get session cookie |
| `/api/method/logout` | `POST` | Clear session |
| `/api/resource/Office Asset` | `GET` | List all office assets |
| `/api/resource/Office Asset/{name}` | `GET` | Get a single asset |
| `/api/resource/Asset Request` | `GET` | List asset requests |
| `/api/resource/Asset Request` | `POST` | Create a new request |
| `/api/resource/Asset Request/{name}` | `PUT` | Update a request (approve/reject) |

---

## 🛠️ Troubleshooting

### `bench start` fails with Redis errors

```bash
# Make sure Redis is running
brew services start redis      # macOS
sudo systemctl start redis     # Linux

# Verify Redis is reachable
redis-cli ping  # should return: PONG
```

### MariaDB connection refused

```bash
brew services start mariadb    # macOS
sudo systemctl start mysql     # Linux
```

### Frontend shows CORS errors

Ensure CORS is configured on your site (Step 9 above) and that the Frappe server is actually running on port `8000`.

### `bench migrate` fails

```bash
# Make sure you are in the bench root, not inside apps/
cd my-bench
bench --site mysite.localhost migrate
```

### `yarn install` fails

Make sure Node.js ≥ 18 is installed:

```bash
node --version   # should show v18.x or higher
```

### Vite dev server can't reach backend

Verify that `VITE_BACKEND_URL` in `apps/assetmanager/frontend/.env` matches the port your Frappe server is running on (default `8000`).

---

## 📝 Additional Notes

- **Hot Reload**: Both servers support hot reload — changes to Python files restart the worker automatically (with `bench start`); changes to Vue files are instantly reflected via Vite HMR.
- **Database GUI**: You can use **TablePlus**, **DBeaver**, or MySQL Workbench to inspect the MariaDB database created by bench.
- **Frappe Desk**: The full Frappe admin desk (with DocType forms, list views, reports) is at **http://localhost:8000/app**.
- **Production Deployment**: For production, run `bench setup production <your-user>` which configures nginx + supervisor. Do **not** use `bench start` in production.

---

*Built with ❤️ using [Frappe Framework](https://frappeframework.com/) and [Vue 3](https://vuejs.org/)*
