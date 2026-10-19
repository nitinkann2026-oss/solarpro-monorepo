# ⚡ SolarPro Energy — Backend Architecture Guide (Beginner Friendly)

Welcome to the backend of the **SolarPro Clean Energy Systems** web application!
If you are new to backend development, this guide explains everything step-by-step in simple, understandable terms.

---

## 📚 1. What is a "Backend"?

When you browse the SolarPro website in React (the **Frontend** / **Client**):
- You see buttons, sliders, images, and forms.
- But if a user fills out a quote request form and clicks **"Submit"**, the browser alone cannot save that information permanently or notify engineers.
- That's where the **Backend** (Server + Database) comes in!

```
┌─────────────────────────────────┐                    ┌─────────────────────────────────┐
│     FRONTEND (React + Vite)     │                    │     BACKEND (Node + Express)    │
│     Running on: Port 5173       │                    │     Running on: Port 5000       │
│                                 │                    │                                 │
│  User fills consultation form   │  HTTP POST Request │  1. Receives form data (body)   │
│  Clicks "Submit Quote Request"  ├───────────────────►│  2. Validates name, phone, etc. │
│                                 │                    │  3. Generates Ticket Number     │
│  Displays Ticket Number to User │  HTTP JSON Response│  4. Saves to Database           │
│  "SOLAR-REQ-#849201"            │◄───────────────────┤  5. Returns HTTP 201 Created    │
└─────────────────────────────────┘                    └─────────────────────────────────┘
                                                                        │
                                                                        ▼
                                                       ┌─────────────────────────────────┐
                                                       │            DATABASE             │
                                                       │  MongoDB or local JSON storage  │
                                                       └─────────────────────────────────┘
```

---

## 🛠️ 2. Core Technologies Used & Why

| Technology | What it is | Why we use it |
|---|---|---|
| **Node.js** | JavaScript Runtime | Allows us to run JavaScript on the computer/server (outside the browser). |
| **Express.js** | Web Framework | Makes creating servers, API routes, and handling HTTP requests quick and easy. |
| **CORS** | Cross-Origin Middleware | Browser security feature that allows the frontend (port 5173) to communicate with the backend (port 5000). |
| **Mongoose** | Object Data Modeling (ODM) | Connects Express to MongoDB. It defines Schemas (rules) and Models (tools to save and search data). |
| **dotenv** | Environment Variables | Reads settings from the `.env` file (like Port and Database URL) so sensitive information isn't hardcoded. |

---

## 📁 3. Project Folder Structure

Here is how the backend is organized and what each file does:

```
backend/
├── .env                  # Private configuration (PORT=5000, MONGODB_URI)
├── .env.example          # Example template for setting up environment variables
├── package.json          # Node.js project manifest & dependencies
├── server.js             # Main server entry point (boots the application)
│
├── config/
│   └── db.js             # Connects to MongoDB with graceful fallback
│
├── models/               # Data blueprints (Schemas & Models)
│   ├── Consultation.js   # Blueprint for customer quote requests
│   ├── Project.js        # Blueprint for solar portfolio projects
│   └── Solution.js       # Blueprint for solar service offerings
│
├── controllers/          # The "Brain" (Logic for each request)
│   ├── consultationController.js # Handles receiving, saving, and listing quotes
│   ├── calculatorController.js   # Calculates solar capacity, panels & 25-yr savings
│   ├── projectController.js      # Retrieves projects from DB
│   └── solutionController.js     # Retrieves solutions from DB
│
├── routes/               # URL Address Book (maps URLs to controllers)
│   ├── consultationRoutes.js # /api/consultations
│   ├── calculatorRoutes.js   # /api/calculator
│   ├── projectRoutes.js      # /api/projects
│   └── solutionRoutes.js     # /api/solutions
│
└── data/                 # Data & fallback storage
    ├── initialProjects.js    # Default solar installation projects
    ├── initialSolutions.js   # Default solar service packages
    ├── storage.js            # Safe file-based fallback storage helper
    └── consultations.json    # JSON database created automatically if MongoDB is offline
```

---

## 🔌 4. API Endpoints (The URLs You Can Call)

### 1. Health & Status
- **URL**: `GET http://localhost:5000/api/health`
- **Description**: Verifies if the server and database are running.
- **Example Response**:
  ```json
  {
    "status": "online",
    "service": "SolarPro Clean Energy Systems Backend API",
    "uptime": "14 seconds",
    "database": "Local File Storage (Active Fallback)"
  }
  ```

---

### 2. Consultation / Free Quote Request
- **URL**: `POST http://localhost:5000/api/consultations`
- **Description**: Called when a user submits the consultation form.
- **Request Body (JSON)**:
  ```json
  {
    "fullName": "Alice Johnson",
    "phone": "+1 (555) 019-2834",
    "email": "alice@example.com",
    "propertyType": "Residential Rooftop",
    "monthlyBill": "$200 - $500",
    "notes": "South-facing roof with no tree obstruction"
  }
  ```
- **Response (HTTP 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Consultation request submitted successfully!",
    "ticketNumber": "SOLAR-REQ-#163018",
    "data": { ... }
  }
  ```

- **URL**: `GET http://localhost:5000/api/consultations`
- **Description**: Returns all saved consultation requests (latest first).

- **URL**: `GET http://localhost:5000/api/consultations/:id`
- **Description**: Retrieves a specific quote by Ticket Reference (e.g. `SOLAR-REQ-#163018`).

---

### 3. Solar Sizing & Financial Calculator
- **URL**: `POST http://localhost:5000/api/calculator/calculate`
- **Description**: Computes exact solar metrics based on electricity consumption.
- **Request Body (JSON)**:
  ```json
  {
    "monthlyBill": 250,
    "propertyType": "residential",
    "sunlightTier": 5.0,
    "includeBattery": false
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "results": {
      "systemSizeKw": 8.3,
      "panelCount": 20,
      "panelWattage": "425W",
      "roofSpaceSqFt": 440,
      "monthlySavings": 213,
      "annualSavings": 2556,
      "cumulative25YearSavings": 93198,
      "annualCo2Tons": 10.8,
      "treesPlantedEquivalent": 244,
      "paybackYears": "4.6 – 5.8"
    }
  }
  ```

---

### 4. Portfolio Projects & Solutions
- **`GET /api/projects`**: Lists all solar installation projects.
- **`GET /api/solutions`**: Lists all solar services & maintenance packages.

---

## 🛡️ 5. Dual Storage Feature (Why it won't crash!)

As a beginner, you might not have MongoDB installed or configured on your computer yet.
In typical projects, if MongoDB isn't running, the server immediately crashes with a confusing error (`ECONNREFUSED 127.0.0.1:27017`).

To prevent this:
1. **With MongoDB running (or MongoDB Atlas in `.env`)**:
   It connects via Mongoose and stores everything in your MongoDB database.
2. **Without MongoDB**:
   It automatically switches to **Local File Storage** (`backend/data/consultations.json`).
   All quotes are saved to this file on your hard drive, ticket numbers are generated, and the frontend works seamlessly without errors!

---

## 🚀 6. How to Run Frontend & Backend Together

### Step 1: Start the Backend Server
Open a terminal in the `backend` folder:
```bash
cd backend
npm run dev
# or: npm start
```
You will see:
```
=======================================================
🚀 SolarPro Backend Server is RUNNING on port 5000
📡 URL: http://localhost:5000
🔍 Health Check: http://localhost:5000/api/health
=======================================================
```

### Step 2: Start the Frontend Application
Open a second terminal in the `solarpannel-frontend` folder:
```bash
cd solarpannel-frontend
npm run dev
```
Open your browser at `http://localhost:5173`. When you submit the quote form in the Contact section, you will see the live API call logged in your backend terminal!
