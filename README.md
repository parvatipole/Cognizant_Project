# Smart Coffee Machine Monitoring System

## Overview
The Smart Coffee Machine Monitoring System is a project developed for Cognizant to monitor and manage coffee machine operations efficiently. It uses Spring Boot for the backend, MySQL for the database, and MQTT (HiveMQ) for testing random data, with JUnit for final testing. The system provides real-time insights into machine status, usage, and maintenance needs.

## Features
- **Real-Time Monitoring:** Tracks coffee machine parameters such as temperature and water levels.
- **Maintenance Alerts:** Notifies users of maintenance requirements based on usage data.
- **Data Storage:** Stores data in MySQL for analytics and reporting.
- **Testing:** Uses MQTT (HiveMQ) to simulate random data and JUnit for unit testing.
- **User Interface:** A dashboard for viewing machine status (to be implemented).

## Prerequisites

### Hardware
- IoT-enabled coffee machine with sensors (e.g., temperature, water level).

### Software
- Java 17+ for Spring Boot.
- MySQL 8.0+ for database.
- Maven for dependency management.
- HiveMQ MQTT broker for testing.
- JUnit 5 for testing.

### Dependencies
- Managed via `pom.xml`.
