-- SQL file to generate sample test data

-- Note: Password salt needs to be generated. Sample hash is for password 'password123'
-- Use bcryptjs to generate real hashes in production

-- Additional Sample Orders
INSERT INTO orders (orderId, consumerId, farmerId, productId, quantity, totalPrice, deliveryAddress, status) VALUES
('ORDER-001-2024', 3, 1, 1, 5, 250.00, '123 Consumer Street, Hyderabad', 'delivered'),
('ORDER-002-2024', 4, 1, 2, 10, 400.00, '456 Buyer Avenue, Bangalore', 'in_transit'),
('ORDER-003-2024', 3, 2, 3, 3, 180.00, '789 Customer Lane, Hyderabad', 'picked');

-- Sample Transport Records
INSERT INTO transport (orderId, transporterId, pickupLocation, deliveryLocation, status, currentLatitude, currentLongitude) VALUES
('ORDER-001-2024', 5, '9876543210', '123 Consumer Street, Hyderabad', 'completed', 17.3850, 78.4867),
('ORDER-002-2024', 6, '9876543211', '456 Buyer Avenue, Bangalore', 'in_transit', 12.9716, 77.5946),
('ORDER-003-2024', 5, '9876543210', '789 Customer Lane, Hyderabad', 'picked', 17.3850, 78.4867);
