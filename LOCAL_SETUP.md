# 🚀 Local Development Setup

## Prerequisites

- **Node.js 18+** and npm
- **Java 17+** and Maven 3.6+
- **MySQL 8.0+**

## Quick Start

### 1. 📁 Get the Code

```bash
# Download or clone the project
# Extract if downloaded as zip
cd coffee-flow-project
```

### 2. ⚡ Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend:** http://localhost:5173

### 3. 🗄️ Database Setup

```bash
# Start MySQL service
# Windows: Start MySQL service from services
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql

# Create database
mysql -u root -p
CREATE DATABASE coffee_flow_db;
EXIT;
```

### 4. 🔧 Backend Setup

```bash
# Navigate to backend
cd backend

# Update database credentials in src/main/resources/application.yml
# Change username/password to match your MySQL setup

# Install and run
mvn clean install
mvn spring-boot:run
```

**Backend:** http://localhost:8080/api

## 🧪 Testing the Setup

### 1. Test Backend

Visit: http://localhost:8080/api/auth/signin

- Should show: `{"timestamp":"...","status":405,"error":"Method Not Allowed"}`
- This means backend is running correctly!

### 2. Test Frontend

Visit: http://localhost:5173

- Should show the CoffeeFlow login page
- Try logging in with:
  - **Technician:** `tech1` / `password`
  - **Admin:** `admin1` / `password`

## 🔑 Demo Accounts

The backend automatically creates these accounts on first run:

| Username | Password | Role       | Permissions                   |
| -------- | -------- | ---------- | ----------------------------- |
| tech1    | password | Technician | Full access (edit everything) |
| admin1   | password | Admin      | View-only access              |

## 📡 Features

### ✅ Working Features

- **JWT Authentication** with real backend
- **Role-based access control**
- **Real-time MQTT simulation**
- **Machine management** (supplies, maintenance)
- **Location navigation** (Location → Office → Floor → Machine)
- **Interactive dashboards** with charts
- **Offline mode** with demo data fallback

### 🎛️ API Endpoints

- `POST /api/auth/signin` - Login
- `GET /api/machines` - Get all machines
- `PUT /api/machines/{id}/supplies` - Update supplies (Technician only)
- `GET /api/machines/locations` - Get locations
- `GET /api/machines/offices?location=X` - Get offices
- `GET /api/machines/floors?location=X&office=Y` - Get floors

## 🐛 Troubleshooting

### Frontend Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port 5173 is free
netstat -tulpn | grep 5173
```

### Backend Issues

```bash
# Check if port 8080 is free
netstat -tulpn | grep 8080

# Check if MySQL is running
systemctl status mysql

# View backend logs
mvn spring-boot:run
# Look for "Started CoffeeFlowApplication"
```

### Database Issues

```bash
# Reset database
mysql -u root -p
DROP DATABASE coffee_flow_db;
CREATE DATABASE coffee_flow_db;
```

### CORS Issues

If you get CORS errors, check that backend `WebSecurityConfig.java` includes:

```java
configuration.setAllowedOriginPatterns(Arrays.asList(
    "http://localhost:*"
));
```

## 🔄 Development Workflow

1. **Start MySQL** service
2. **Start Backend** (`mvn spring-boot:run`)
3. **Start Frontend** (`npm run dev`)
4. **Open browser** to http://localhost:5173
5. **Login** with demo accounts
6. **Develop and test** features

## 📝 Environment Variables

Create `client/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_DEBUG=true
```

## 🚀 Production Build

```bash
# Build frontend
npm run build

# Build backend
cd backend
mvn clean package
```

## 📖 Project Structure

```
coffee-flow-project/
├── client/                 # React frontend
│   ├── src/
│   ├── components/ui/      # UI components
│   ├── pages/             # Route components
│   ├── contexts/          # React contexts
│   ├── lib/               # API & utilities
│   └── .env.local         # Local environment
├── backend/               # Spring Boot backend
│   ├── src/main/java/     # Java source
│   ├── src/main/resources/ # Configuration
│   └── pom.xml            # Maven dependencies
└── README.md
```

Happy coding! 🎉
