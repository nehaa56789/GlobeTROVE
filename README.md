#  GlobeTrove – Travel Booking & Destination Discovery Platform
## Deployed site :  https://globetrove.vercel.app/
##  Project Overview
GlobeTrove is a web-based travel booking and destination discovery platform designed to simplify how users explore, plan, and book travel experiences. It provides curated destinations, transparent pricing, secure booking, and immersive previews such as virtual tours, all within a single unified interface.

---

##  Problem It Solves
Modern travelers face:
- Fragmented travel planning across multiple platforms
- Information overload and lack of curated recommendations
- Poor mobile experiences during booking
- Limited trust due to lack of authentic previews

GlobeTrove solves these by offering a centralized, user-friendly, and trustworthy travel booking experience.

---

## Target Users (Personas)

###  Persona 1: Budget Traveler (Student / Young Professional)
- Age: 18–30  
- Goals: Affordable trips, easy booking, clear pricing  
- Pain Points: Too many platforms, confusing interfaces  

###  Persona 2: Travel Enthusiast
- Age: 25–45  
- Goals: Discover unique destinations, immersive previews  
- Pain Points: Generic listings, lack of inspiration  

###  Persona 3: Platform Administrator
- Goals: Manage destinations, bookings, and users  
- Pain Points: Manual tracking, lack of centralized control  

---

##  Vision Statement
“To create a seamless, trustworthy, and engaging travel platform that empowers users to discover and book memorable travel experiences effortlessly.”

---

##  Key Features / Goals
- Secure user authentication and profile management
- Destination discovery with search and filters
- Wishlist and booking cart
- Secure online payment integration
- Booking history and confirmations
- Admin dashboard for content and user management
- Virtual tours and rich media (optional)

---

##  Success Metrics
- 80% of users complete booking without assistance
- Successful payment transactions with zero critical failures
- Average page load time under 3 seconds
- Positive usability feedback from test users

---

##  Assumptions & Constraints

### Assumptions
- Users have internet access and basic web literacy
- Users are willing to create accounts
- Third-party services (PayPal, hosting) are reliable

### Constraints
- Academic project timeline
- Open-source / free tools only
- Student-level development resources
- Compliance with data security standards

> Feature branch: authentication setup


## Figma Wireframes
Figma link: https://www.figma.com/design/J8QhVYW5wu50TCJSuWNJBU/GlobeTROVE?node-id=0-1&t=exKy3OFqTz2SvxE3-1

## Draw.io Wireframes
Draw.io link: https://drive.google.com/file/d/1_gQeV6JScSTqGtbJ7caM6T8teWhBu5sF/view?usp=sharing

## Quick Start – Local Development

### Prerequisites
- Git
- Docker Desktop
- VS Code

### Run Locally Using Docker
The application is containerized using a multi-stage Docker build and served via NGINX inside a production container.
```bash
docker-compose up --build
```

---


## Software Design

#### Architecture Diagram

![Architecture Diagram1](Design/Draw.io/GlobeTrove.drawio.png)
![Architecture Diagram2](Design/Draw.io/class_diagram.png)
![Architecture Diagram3](Design/Draw.io/usecase(1).png)
![Architecture Diagram4](Design/Draw.io/Diagram1.png)

#### UI/UX Designs

![Figma WireFrames1](Design/Figma/F1(1).png)
![Figma WireFrames2](Design/Figma/F1(2).png)
![Figma WireFrames3](Design/Figma/Frame1.png)
![Figma WireFrames4](Design/Figma/Frame2.1_2.2.png)


GlobeTROVE was designed using a client–server architecture with a layered frontend structure to ensure clear separation of concerns. The system emphasizes modularity by organizing features into independent modules such as authentication, booking, and destination management. Abstraction was applied through a dedicated service layer for API communication, keeping UI components independent from backend logic. High cohesion and low coupling were maintained by ensuring each module has a single responsibility and minimal dependencies. These design choices improve scalability, maintainability, and ease of future enhancements.






# **Lastest Update** #





# ✈ GlobeTrove — Full-Stack Travel Booking App

A fully modularized travel booking platform with a React frontend and Node.js/Express backend.

---

## 📁 Project Structure

```
globetrove/
├── backend/
│   ├── controllers/
│   │   ├── authController.js         # Register, login, getMe
│   │   ├── bookingsController.js     # Get/cancel user bookings
│   │   ├── destinationsController.js # List, filter, get by ID
│   │   ├── flightsController.js      # List, filter, book
│   │   ├── hotelsController.js       # List, filter, book
│   │   └── wishlistController.js     # Get, toggle wishlist item
│   ├── data/
│   │   └── mockData.js               # In-memory data store
│   ├── middleware/
│   │   └── auth.js                   # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── destinations.js
│   │   ├── flights.js
│   │   ├── hotels.js
│   │   └── wishlist.js
│   ├── .env                          # Environment variables
│   ├── package.json
│   └── server.js                     # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── DestCard.jsx           # Destination card with wishlist
    │   │   ├── Footer.jsx
    │   │   ├── GlobalStyles.jsx       # Global CSS + Google Fonts
    │   │   ├── Navbar.jsx
    │   │   ├── Skeleton.jsx           # Loading skeleton
    │   │   └── ToastContainer.jsx     # Toast notification system
    │   ├── hooks/
    │   │   ├── useAuth.js             # Login, register, logout + localStorage
    │   │   ├── useToast.js            # Toast state management
    │   │   └── useWishlist.js         # Optimistic wishlist with server sync
    │   ├── pages/
    │   │   ├── AuthPage.jsx           # Login / Sign-up form
    │   │   ├── DashboardPage.jsx      # User bookings + profile stats
    │   │   ├── FlightsPage.jsx        # Flight search + booking
    │   │   ├── HomePage.jsx           # Hero, destinations, carousel, stats
    │   │   ├── HotelsPage.jsx         # Hotel search + booking
    │   │   ├── MapPage.jsx            # Interactive world map
    │   │   └── WishlistPage.jsx       # Saved destinations
    │   ├── utils/
    │   │   └── api.js                 # Axios instance + all API calls
    │   ├── App.jsx                    # Root component — wires everything
    │   └── index.js                   # React entry point
    └── package.json
```

---

## 🚀 How to Run

### Prerequisites
- **Node.js** v18+ (check: `node -v`)
- **npm** v9+ (check: `npm -v`)

---

### Step 1 — Start the Backend

```bash
cd globetrove/backend
npm install
npm run dev       # uses nodemon for auto-reload
# OR
npm start         # plain node, no auto-reload
```

The API will start at **http://localhost:5000**

Test it:
```bash
curl http://localhost:5000/api/health
```
Expected: `{"success":true,"message":"GlobeTrove API is running 🌍",...}`

---

### Step 2 — Start the Frontend (in a new terminal)

```bash
cd globetrove/frontend
npm install
npm start
```

React will open **http://localhost:3000** in your browser automatically.

The `"proxy": "http://localhost:5000"` in `frontend/package.json` routes all `/api/*`
calls to your backend — no CORS issues.

---

## 🔌 API Endpoints Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get logged-in user |

### Destinations
| Method | Endpoint | Query Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/destinations` | `tag`, `maxPrice`, `sort` | List all |
| GET | `/api/destinations/popular` | — | Popular places |
| GET | `/api/destinations/:id` | — | Get one by ID |

### Flights
| Method | Endpoint | Query Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/flights` | `from`, `to`, `class`, `stops`, `sort` | Search flights |
| GET | `/api/flights/:id` | — | Get one by ID |
| POST | `/api/flights/book` | — (body: `flightId`) | Book a flight ✅ |

### Hotels
| Method | Endpoint | Query Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/hotels` | `city`, `stars`, `sort` | Search hotels |
| GET | `/api/hotels/:id` | — | Get one by ID |
| POST | `/api/hotels/book` | — (body: `hotelId`, `checkIn`, `checkOut`) | Book a hotel ✅ |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get my bookings ✅ |
| DELETE | `/api/bookings/:id` | Cancel a booking ✅ |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get my wishlist ✅ |
| POST | `/api/wishlist/:destId` | Toggle destination in wishlist ✅ |

✅ = Requires `Authorization: Bearer <token>` header

---

## ⚙️ Environment Variables

Edit `backend/.env`:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a long random string before deploying.

---

## 🔄 How Frontend ↔ Backend Are Wired

1. **`frontend/src/utils/api.js`** — Axios instance with base URL `/api` and auto JWT injection
2. **`frontend/package.json`** — `"proxy": "http://localhost:5000"` forwards API calls to Express
3. **`useAuth.js`** — Stores JWT in `localStorage` as `gt_token`, user as `gt_user`
4. **`useWishlist.js`** — Optimistic local updates + server sync when logged in
5. Every page calls the API on mount (`useEffect`) and handles loading/error states

---

## 🛠️ Upgrading to a Real Database

The backend uses in-memory arrays (`mockData.js`). To connect a real database:

1. Install: `npm install mongoose` (MongoDB) or `npm install pg` (PostgreSQL)
2. Replace the arrays in `mockData.js` with DB models
3. Update controllers to use `async/await` with DB queries
4. Add a `DB_URI` to `.env`

Data currently resets when the server restarts — by design for this demo.