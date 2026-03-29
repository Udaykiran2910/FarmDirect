-- Create Farm Supply Chain Database Schema

CREATE DATABASE IF NOT EXISTS farm_supply_chain;
USE farm_supply_chain;

-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  primaryRole ENUM('farmer', 'transporter', 'consumer') NOT NULL,
  profileImage VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (primaryRole)
);

-- User Roles (for multi-role support)
CREATE TABLE user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  role ENUM('farmer', 'transporter', 'consumer') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_role (userId, role),
  INDEX idx_userId (userId)
);

-- Products Table
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  farmerId INT NOT NULL,
  cropName VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmerId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_farmerId (farmerId),
  INDEX idx_cropName (cropName),
  INDEX idx_location (location)
);

-- Orders Table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId VARCHAR(255) UNIQUE NOT NULL,
  consumerId INT NOT NULL,
  farmerId INT NOT NULL,
  productId INT NOT NULL,
  transporterId INT,
  quantity INT NOT NULL,
  totalPrice DECIMAL(10, 2) NOT NULL,
  deliveryAddress TEXT NOT NULL,
  status ENUM('pending', 'assigned', 'picked', 'in_transit', 'delivered', 'canceled') DEFAULT 'pending',
  qrCode VARCHAR(500),
  deleted BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (consumerId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (farmerId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (transporterId) REFERENCES users(id),
  INDEX idx_orderId (orderId),
  INDEX idx_consumerId (consumerId),
  INDEX idx_farmerId (farmerId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);

-- Transport Details Table
CREATE TABLE transport (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId VARCHAR(255) NOT NULL,
  transporterId INT NOT NULL,
  pickupLocation VARCHAR(255),
  deliveryLocation TEXT NOT NULL,
  currentLocation VARCHAR(255),
  currentLatitude DECIMAL(10, 8),
  currentLongitude DECIMAL(11, 8),
  status ENUM('assigned', 'picked', 'in_transit', 'completed') DEFAULT 'assigned',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(orderId) ON DELETE CASCADE,
  FOREIGN KEY (transporterId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_orderId (orderId),
  INDEX idx_transporterId (transporterId),
  INDEX idx_status (status)
);

-- Blockchain Records Table
CREATE TABLE blockchain_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId VARCHAR(255) NOT NULL,
  blockHash VARCHAR(255) NOT NULL,
  previousHash VARCHAR(255) NOT NULL,
  farmerInfo JSON,
  consumerInfo JSON,
  transportInfo JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(orderId) ON DELETE CASCADE,
  INDEX idx_orderId (orderId),
  INDEX idx_blockHash (blockHash)
);

-- Insert Sample Data
INSERT INTO users (email, password, fullName, phone, primaryRole) VALUES
('farmer1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye2oCIRpDa5fwTzXfVfW8j0qZHv5.qjz.', 'Ramesh Farmer', '9876543210', 'farmer'),
('farmer2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye2oCIRpDa5fwTzXfVfW8j0qZHv5.qjz.', 'Priya Farmer', '9876543211', 'farmer'),
('consumer1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye2oCIRpDa5fwTzXfVfW8j0qZHv5.qjz.', 'Amit Consumer', '9876543212', 'consumer'),
('consumer2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye2oCIRpDa5fwTzXfVfW8j0qZHv5.qjz.', 'Shruti Consumer', '9876543213', 'consumer'),
('transporter1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye2oCIRpDa5fwTzXfVfW8j0qZHv5.qjz.', 'Raj Transporter', '9876543214', 'transporter'),
('transporter2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye2oCIRpDa5fwTzXfVfW8j0qZHv5.qjz.', 'Vikram Transporter', '9876543215', 'transporter');

INSERT INTO user_roles (userId, role) VALUES
(1, 'farmer'),
(2, 'farmer'),
(3, 'consumer'),
(4, 'consumer'),
(5, 'transporter'),
(6, 'transporter');

INSERT INTO products (farmerId, cropName, price, quantity, location, image, description) VALUES
(1, 'Tomato', 50.00, 100, 'Hyderabad', 'https://via.placeholder.com/300x300?text=Tomato', 'Fresh red tomatoes from farm'),
(1, 'Onion', 40.00, 150, 'Hyderabad', 'https://via.placeholder.com/300x300?text=Onion', 'Golden onions'),
(2, 'Carrot', 60.00, 80, 'Bangalore', 'https://via.placeholder.com/300x300?text=Carrot', 'Orange carrots rich in vitamins'),
(2, 'Broccoli', 70.00, 50, 'Bangalore', 'https://via.placeholder.com/300x300?text=Broccoli', 'Fresh green broccoli'),
(1, 'Potato', 30.00, 200, 'Hyderabad', 'https://via.placeholder.com/300x300?text=Potato', 'Quality potatoes'),
(2, 'Spinach', 45.00, 60, 'Bangalore', 'https://via.placeholder.com/300x300?text=Spinach', 'Fresh spinach leaves');

-- Create indexes for better performance
CREATE INDEX idx_orders_status_timestamp ON orders(status, createdAt);
CREATE INDEX idx_products_price_quantity ON products(price, quantity);
