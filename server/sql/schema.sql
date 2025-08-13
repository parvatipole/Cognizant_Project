CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('technician','admin') NOT NULL,
  assigned_location VARCHAR(100) NULL,
  assigned_office VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS machines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  machine_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  office_id INT NOT NULL,
  status ENUM('operational','maintenance','offline') NOT NULL DEFAULT 'operational',
  daily_cups INT NOT NULL DEFAULT 0,
  efficiency INT NOT NULL DEFAULT 0,
  supplies_water INT NOT NULL DEFAULT 0,
  supplies_milk INT NOT NULL DEFAULT 0,
  supplies_coffee INT NOT NULL DEFAULT 0,
  supplies_sugar INT NOT NULL DEFAULT 0,
  FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE
);