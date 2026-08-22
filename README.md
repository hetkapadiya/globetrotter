# 🌍 GlobeTrotter

> A personalized multi-city travel planning platform for discovering destinations, building itineraries, scheduling activities, managing budgets, and visualizing journeys in one place.

## 🚀 Live Demo

- 🌐 **Frontend:** https://globetrotter-front-u0bt.onrender.com
- ⚙️ **Backend API:** https://globetrotter-back.onrender.com
- ❤️ **API Health:** https://globetrotter-back.onrender.com/api/health
- 💻 **GitHub:** https://github.com/hetkapadiya/globetrotter

---

## 🎯 Problem

Travel planning is often scattered across maps, notes, spreadsheets, booking sites, and messaging apps. Multi-city planning, activity scheduling, and budget tracking can therefore become difficult.

GlobeTrotter brings the core workflow into one application:

**Discover → Plan → Schedule → Budget → Visualize → Manage**

## 💡 Solution

GlobeTrotter lets travelers:

- Create personalized trips
- Select multiple cities and travel dates
- Discover activities for destinations
- Add activities to an itinerary
- Set a travel budget
- View trips through a calendar
- Manage existing trips
- Authenticate securely
- Access travel data through REST APIs

---

## ✨ Features

### 🔐 Authentication
- Registration and login
- JWT-based authentication
- Protected API endpoints
- Current-user authentication
- User-specific trip data
- Logout

### 🏠 Dashboard
- Upcoming travel overview
- Quick actions
- Create a trip
- Discover destinations
- Open calendar
- Profile/account controls

### 🗺️ Multi-City Trip Planning
Users can create trips with:

- Trip name
- Description
- Start/end dates
- Planned budget
- Multiple destinations/stops
- Individual dates for each destination

Example:

```text
Goa Escape
10 Sep → 15 Sep

Ahmedabad → Mumbai → Goa
```

### 📍 Destination Management
Cities can contain:

- Name
- Country
- Region
- Cost index
- Popularity
- Image
- Description

### 🎯 Activity Discovery
Activities can contain:

- Name
- Description
- Category
- Duration
- Estimated cost
- Image

### ➕ Activity Picker
Users can:

- Load activities for a city
- Browse available activities
- View estimated cost and duration
- Add activities to a trip itinerary

### 📅 Travel Calendar
- Monthly calendar
- Previous/next month navigation
- Today shortcut
- Trips displayed on travel dates
- Trip selection
- Upcoming journeys
- Travel statistics

### 🧳 My Trips
Users can view:

- Trip name
- Dates
- Duration
- Destinations
- Budget
- Status
- Trip details
- Delete trip

### 📋 Trip Details
Combines:

- Trip information
- Destinations
- Dates
- Activities
- Itinerary
- Budget

### 💰 Budget Planning
Trips support planned budgets and activity costs, providing the foundation for budget analytics and warnings.

---

## 🌟 Smart Budget Guard

A planned differentiating feature is the **Smart Budget Guard**.

Example:

```text
Trip Budget           ₹18,000
Current planned       ₹15,500
New activity           ₹4,000
--------------------------------
⚠ Budget Warning

This activity may push the trip
above the planned budget.

Consider a lower-cost alternative.
```

This turns budget tracking into an active planning assistant.

---

## 🧠 How It Works

### Authentication

```text
React Client
     ↓
POST /api/auth/login
     ↓
Express Backend
     ↓
Validate credentials
     ↓
JWT Token
     ↓
Protected API Requests
```

### Create a Trip

```text
Trip name
Description
Start date
End date
Budget
Destinations
        ↓
POST /api/trips
        ↓
Express
        ↓
Prisma
        ↓
PostgreSQL
```

### Add Destinations

```text
Trip
 ├── Mumbai
 ├── Goa
 └── Bangalore
```

Each stop stores its dates and order.

### Discover and Add Activities

```http
GET /api/activities?cityId=<CITY_ID>
```

Selected activities can be associated with the itinerary through:

```http
POST /api/activities/trip
```

### Visualize

```text
My Trips
   ↓
Trip Details
   ↓
Calendar
```

---

## 🏗️ Architecture

```text
┌───────────────────────────────────┐
│            React Client           │
│                                   │
│ Dashboard                         │
│ Authentication                    │
│ My Trips                          │
│ Create Trip                       │
│ Calendar                          │
│ Discover                          │
│ Activity Picker                   │
│ Trip Details                      │
└─────────────────┬─────────────────┘
                  │ HTTPS / REST
                  ▼
┌───────────────────────────────────┐
│        Node.js + Express          │
│                                   │
│ Authentication API                │
│ Cities API                        │
│ Trips API                         │
│ Activities API                    │
│ Authentication Middleware         │
└─────────────────┬─────────────────┘
                  │ Prisma ORM
                  ▼
┌───────────────────────────────────┐
│       PostgreSQL / Supabase       │
│                                   │
│ User                              │
│ Trip                              │
│ City                              │
│ TripStop                          │
│ Activity                          │
│ TripActivity                      │
│ Expense                           │
│ SavedDestination                  │
└───────────────────────────────────┘
```

---

## 🗄️ Database

GlobeTrotter uses PostgreSQL with Prisma ORM.

### User

```text
id
name
email
password
avatar
createdAt
updatedAt
```

### Trip

```text
id
userId
name
description
startDate
endDate
coverImage
budget
isPublic
shareCode
```

### City

```text
id
name
country
region
costIndex
popularity
image
description
```

### TripStop

```text
tripId
cityId
startDate
endDate
order
```

### Activity

```text
cityId
name
description
category
duration
estimatedCost
image
```

### TripActivity

```text
tripId
tripStopId
activityId
date
startTime
endTime
customCost
```

### Expense

```text
tripId
category
description
amount
date
```

### SavedDestination

```text
userId
cityId
createdAt
```

---

## 🔌 API

### Health

```http
GET /api/health
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Cities

```http
GET /api/cities
GET /api/cities/:id
```

### Trips

```http
GET    /api/trips
GET    /api/trips/:id
POST   /api/trips
PUT    /api/trips/:id
DELETE /api/trips/:id
```

### Activities

```http
GET  /api/activities
GET  /api/activities/:id
POST /api/activities/trip
```

---

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Lucide React

### Backend
- Node.js
- Express.js
- REST APIs
- JWT authentication

### Database
- PostgreSQL
- Supabase
- Prisma ORM

### Deployment
- Render Static Site — Frontend
- Render Web Service — Backend
- Supabase — PostgreSQL
- GitHub — Source control

### Development
- Git
- GitHub
- npm
- Nodemon
- PowerShell
- VS Code

---

## 📁 Project Structure

```text
globetrotter/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Auth.jsx
│   │   ├── Calendar.jsx
│   │   ├── MyTrips.jsx
│   │   ├── CreateTrip.jsx
│   │   ├── TripDetails.jsx
│   │   ├── ActivityPicker.jsx
│   │   ├── config.js
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup

### Clone

```bash
git clone https://github.com/hetkapadiya/globetrotter.git
cd globetrotter
```

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../server
npm install
```

### Environment Variables

Create `server/.env`:

```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Never commit real secrets or production database credentials.

### Prisma

From `server`:

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

### Run Backend

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Run Frontend

From `client`:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## ☁️ Deployment

GlobeTrotter is deployed on Render.

### Frontend

```text
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
```

Production variable:

```env
VITE_API_URL=https://globetrotter-back.onrender.com
```

Live:

https://globetrotter-front-u0bt.onrender.com

### Backend

```text
Root Directory: server
Build Command: npm install && npx prisma generate
Start Command: npm start
```

Production variables:

```env
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://globetrotter-front-u0bt.onrender.com
```

Live:

https://globetrotter-back.onrender.com

---

## 🔒 Security

The application uses:

- Protected API endpoints
- Bearer-token authorization
- JWT authentication
- Server-side validation
- Environment variables for secrets
- Database relationships and constraints
- Unique constraints
- CORS configuration

For a larger production deployment, rate limiting, secure secret management, refresh tokens, stronger password policies, monitoring, and additional security hardening can be added.

---

## 🧪 Example User Journey

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Create "Goa Escape"
   ↓
Select travel dates
   ↓
Add Mumbai
   ↓
Add Goa
   ↓
Discover activities
   ↓
Add activities
   ↓
Review budget
   ↓
Open Calendar
   ↓
View Trip Details
   ↓
Modify itinerary
```

---

## 🏆 Why GlobeTrotter?

GlobeTrotter connects the complete travel-planning workflow:

```text
DISCOVER
   ↓
PLAN
   ↓
SCHEDULE
   ↓
BUDGET
   ↓
VISUALIZE
   ↓
MANAGE
```

For example:

```text
Add Activity
     ↓
Activity belongs to City
     ↓
Activity belongs to Trip Stop
     ↓
Activity belongs to Trip
     ↓
Cost contributes to planning
     ↓
Activity appears in itinerary
     ↓
Trip appears in calendar
```

---

## 🚀 Future Enhancements

- AI-powered itinerary generation
- Smart budget recommendations
- Cheaper activity alternatives
- Travel-time optimization
- Public trip sharing
- Shareable trip links
- Collaborative trip planning
- Maps and route visualization
- Weather-aware itinerary suggestions
- Hotel and transportation integration
- Offline itinerary access
- Mobile application
- Personalized destination recommendations
- Advanced travel analytics

---

## 📌 Development Status

### Completed

- [x] React frontend
- [x] Express backend
- [x] PostgreSQL database
- [x] Prisma ORM
- [x] Authentication
- [x] JWT authorization
- [x] City API
- [x] Trip API
- [x] Trip creation
- [x] Multi-city trip stops
- [x] My Trips
- [x] Trip Details
- [x] Calendar
- [x] Activity API
- [x] Activity selection
- [x] Activity addition
- [x] Production CORS configuration
- [x] Git/GitHub integration
- [x] Render deployment

### Planned / Improving

- [ ] Smart Budget Guard
- [ ] Advanced budget analytics
- [ ] Public trip sharing
- [ ] AI itinerary optimization
- [ ] Advanced travel recommendations
- [ ] Collaborative trip planning

---

## 👥 Team

Built as a collaborative travel-planning project for a hackathon.

---

## 📜 License

This project is developed for educational, hackathon, and demonstration purposes.
