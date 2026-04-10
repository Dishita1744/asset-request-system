# Office Asset Request System

A modern, robust Office Asset Request System leveraging a high-performance backend with **Frappe** and a reactive frontend using **Vue 3**. This system enables employees to browse, request, and track office assets, while accommodating administrative actions.

## 🌟 Overview & Architecture

### Architecture Flow
1. **Frontend**: Vite + Vue 3 Single Page Application connecting directly with Frappe’s stateless REST API `/api/resource/...` and `/api/method/...`.
2. **Backend**: Frappe Framework (Python) serving via a WSGI server (`gunicorn`/`werkzeug`), backed by a MariaDB relational database and Redis cache.
3. **Authentication**: Cookie-based Session Auth secured by `X-Frappe-CSRF-Token` mechanisms.  

### Core Data & Method Flows
- **Assets (DocType: `Office Asset`)**: Contains asset availability pool (`total_quantity`, `available_quantity`). 
- **Requests (DocType: `Asset Request`)**: Holds the requester log. When an employee requests an asset, a new record is created in `Pending` state.
    - *Validation (`before_insert` hook)*: The Python system prevents a request if `available_quantity <= 0`.
    - *Fulfillment (`on_update` hook)*: When an admin marks the request as `Approved`, the `available_quantity` of the corresponding `Office Asset` is decremented in real time.

### Component Structure
```text
├── assetmanager/
│   ├── config, public, www... (Standard Frappe layout)
│   ├── asset_manager/
│   │   ├── doctype/
│   │   │   ├── office_asset/ (Schema: json & logic: py)
│   │   │   └── asset_request/ (Schema: json & logic: py)
│   │   └── seed.py (Script to hydrate Initial Assets)
│   └── frontend/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Login.vue (Handles Vue/Frappe Auth)
│       │   │   ├── Dashboard.vue (Displays Assets pool & Request modal)
│       │   │   └── MyRequests.vue (Filtered view of User's asset requests)
│       │   ├── router/index.js (Guards routes + authentication middleware)
│       │   ├── App.vue
│       │   └── main.js
│       ├── vite.config.js (Reverse Proxies /api to 8000)
│       └── package.json
```

---

## 🛠 Prerequisites

- **macOS** with Homebrew installed 
- **Python 3.14+** (via `uv`)
- **Node.js 24+** and **yarn**
- **MariaDB 11.8+** safely running on default port (`brew services start mariadb@11.8`)
- **Redis** running (`brew services start redis`)

---

## 🚀 Installation & Setup from Scratch

### 1. Initialize the Frappe Environment
Open a terminal and set up the Frappe bench and site:
```bash
# 1. Init a new Frappe bench environment
bench init my-bench --frappe-branch version-15

# 2. Enter workspace
cd my-bench

# 3. Create a site linked to your database
bench new-site mysite.localhost --mariadb-root-password 'root123' --admin-password 'admin123'

# 4. Enable Developer Mode for file-based configuration editing
bench --site mysite.localhost set-config developer_mode 1
bench --site mysite.localhost clear-cache
```

### 2. Deploy the Asset Manager Application
```bash
# Get the custom app files & dependencies installed
bench --site mysite.localhost install-app assetmanager

# Run DocType Migrations
bench --site mysite.localhost migrate

# Hydrate the DB with initial Office Assets
bench --site mysite.localhost execute assetmanager.seed.run
```

### 3. Start Backend Services
Launch the backend server locally (default on http://localhost:8000):
```bash
bench start
```

### 4. Boot the Vue 3 Frontend
Open a new terminal window:
```bash
cd my-bench/apps/assetmanager/frontend
yarn install
yarn dev
```

Navigate your browser to `http://localhost:5173`. 
The system routes all unauthenticated visitors to `/login`.

---

## 🔑 Login & Operations
To access the Asset System Dashboard:
1. Provide Email: `Administrator`
2. Provide Password: `admin123`
3. Hit `Login` to retrieve the active session cookies.

**Admin Operations (Backend UI)**:
Visit `http://localhost:8000` to log into the Frappe Desk. Go to **Asset Request List** to approve pending employee requests and finalize inventory decrement.
