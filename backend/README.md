# CoffeeFlow Backend

A Spring Boot REST API for the Coffee Vending Machine Management System with JWT authentication and MySQL database.

## Features

- **JWT Authentication** with role-based access control
- **MySQL Database** integration with JPA/Hibernate
- **Role-based Security** (Technician vs Admin)
- **RESTful APIs** for machine management
- **Auto-initialization** with sample data

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Security** with JWT
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**

## Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### Database Setup

1. Install MySQL and create a database:

```sql
CREATE DATABASE coffee_flow_db;
```

2. Update database credentials in `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/coffee_flow_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: your_password
```

### Run the Application

1. Clone and navigate to backend directory
2. Install dependencies:

```bash
mvn clean install
```

3. Run the application:

```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080/api`

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Coffee Machines

- `GET /api/machines` - Get all machines
- `GET /api/machines/{id}` - Get machine by ID
- `GET /api/machines/machine/{machineId}` - Get machine by machine ID
- `PUT /api/machines/{id}` - Update machine (Technician only)
- `PUT /api/machines/{id}/supplies` - Update supply levels (Technician only)
- `GET /api/machines/locations` - Get all locations
- `GET /api/machines/offices?location=X` - Get offices by location
- `GET /api/machines/floors?location=X&office=Y` - Get floors by location and office
- `GET /api/machines/low-supplies?threshold=30` - Get machines with low supplies
- `GET /api/machines/maintenance-needed` - Get machines needing maintenance

## Sample Data

The application automatically creates:

### Users

- **Technician**: `tech1` / `password` (Full access)
- **Admin**: `admin1` / `password` (Read-only access)

### Coffee Machines

- Machine A-001 (New York - Main Office - 2nd Floor)
- Machine A-002 (New York - Main Office - 1st Floor)
- Machine B-001 (Los Angeles - West Branch - Ground Floor)

## Authentication

### Login Request

```json
POST /api/auth/signin
{
  "username": "tech1",
  "password": "password"
}
```

### Login Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "id": 1,
  "username": "tech1",
  "name": "John Technician",
  "role": "technician",
  "authorities": ["ROLE_TECHNICIAN"]
}
```

### Using JWT Token

Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Security

- **JWT Tokens** expire in 24 hours
- **CORS** enabled for frontend integration
- **Role-based access**: Technicians can edit, Admins can only view
- **Password encryption** using BCrypt

## Database Schema

### Users Table

- id, username, name, password, role, created_at, updated_at, last_login

### Coffee Machines Table

- id, machine_id, name, location, office, floor, status
- Supply levels: water_level, milk_level, coffee_beans_level, sugar_level
- Maintenance: filter_status, cleaning_status, temperature, pressure
- Usage: daily_cups, weekly_cups, monthly_revenue
- Timestamps: created_at, updated_at

## Development

### Building

```bash
mvn clean package
```

### Running Tests

```bash
mvn test
```

### Creating JAR

```bash
mvn clean package -DskipTests
java -jar target/coffee-flow-backend-0.0.1-SNAPSHOT.jar
```

## Production Deployment

1. Update `application.yml` for production database
2. Set secure JWT secret
3. Configure proper CORS origins
4. Use environment variables for sensitive data

## API Testing

You can test the APIs using tools like Postman or curl:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"tech1","password":"password"}'

# Get machines (with JWT token)
curl -X GET http://localhost:8080/api/machines \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
