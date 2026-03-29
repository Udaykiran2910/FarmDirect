# API Documentation - FarmDirect Platform

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "9876543210",
  "role": "consumer"  // farmer, consumer, transporter
}

Response 201:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "consumer"
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "farmer1@example.com",
  "password": "password123",
  "role": "farmer"
}

Response 200:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "farmer1@example.com",
    "fullName": "Ramesh Farmer",
    "phone": "9876543210",
    "role": "farmer"
  }
}
```

### Get Profile
```
GET /auth/profile
Authorization: Bearer <token>

Response 200:
{
  "user": {
    "id": 1,
    "email": "farmer1@example.com",
    "fullName": "Ramesh Farmer",
    "phone": "9876543210",
    "primaryRole": "farmer",
    "roles": ["farmer"]
  }
}
```

### Update Profile
```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Ramesh Updated",
  "phone": "9876543211"
}

Response 200:
{
  "success": true,
  "user": { ... }
}
```

### Switch Role
```
POST /auth/switch-role
Authorization: Bearer <token>
Content-Type: application/json

{
  "newRole": "transporter"
}

Response 200:
{
  "success": true,
  "token": "new_jwt_token_here",
  "role": "transporter"
}
```

---

## 🌾 Product Endpoints

### Add Product (Farmer Only)
```
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "cropName": "Tomato",
  "price": 50.00,
  "quantity": 100,
  "location": "Hyderabad",
  "description": "Fresh red tomatoes",
  "image": "https://url.to.image.jpg"  // optional
}

Response 201:
{
  "success": true,
  "message": "Product added successfully",
  "productId": 1
}
```

### Get All Products
```
GET /products/all?search=tomato&location=hyderabad&minPrice=40&maxPrice=60
Response 200:
[
  {
    "id": 1,
    "cropName": "Tomato",
    "price": 50.00,
    "quantity": 100,
    "location": "Hyderabad",
    "farmerName": "Ramesh Farmer",
    "farmerPhone": "9876543210",
    "image": "...",
    "description": "..."
  }
]
```

### Get Product Details
```
GET /products/:productId
Response 200:
{
  "id": 1,
  "cropName": "Tomato",
  "price": 50.00,
  "quantity": 100,
  "location": "Hyderabad",
  "farmerName": "Ramesh Farmer",
  "farmerEmail": "farmer1@example.com",
  "farmerPhone": "9876543210",
  "image": "...",
  "description": "..."
}
```

### Get My Products (Farmer Only)
```
GET /products/farmer
Authorization: Bearer <token>
Response 200:
[
  { ... product 1 },
  { ... product 2 }
]
```

### Update Product (Farmer Only)
```
PUT /products/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "cropName": "Tomato Updated",
  "price": 55.00,
  "quantity": 95,
  "location": "Hyderabad",
  "description": "Fresh red tomatoes",
  "image": "..."
}

Response 200:
{
  "success": true,
  "message": "Product updated"
}
```

### Delete Product (Farmer Only)
```
DELETE /products/:productId
Authorization: Bearer <token>
Response 200:
{
  "success": true,
  "message": "Product deleted"
}
```

---

## 📦 Order Endpoints

### Place Order (Consumer Only)
```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 5,
  "deliveryAddress": "123 Main Street, City, State"
}

Response 201:
{
  "success": true,
  "message": "Order placed successfully",
  "orderId": "ORDER-uuid-here",
  "totalPrice": 250.00
}
```

### Get Order Details
```
GET /orders/:orderId
Authorization: Bearer <token>

Response 200:
{
  "order": {
    "orderId": "ORDER-xxx",
    "consumerName": "Amit",
    "farmerName": "Ramesh",
    "farmerPhone": "9876543210",
    "consumerName": "Amit",
    "cropName": "Tomato",
    "quantity": 5,
    "totalPrice": 250.00,
    "deliveryAddress": "123 Main Street",
    "status": "pending",
    "qrCode": "/qr-codes/ORDER-xxx.png"
  },
  "blockchainHistory": [ ... ]
}
```

### Get My Orders (Consumer)
```
GET /orders/consumer/all
Authorization: Bearer <token>

Response 200:
[
  {
    "orderId": "ORDER-xxx",
    "productId": 1,
    "cropName": "Tomato",
    "farmerName": "Ramesh Farmer",
    "quantity": 5,
    "totalPrice": 250.00,
    "status": "pending",
    "createdAt": "2024-03-28T10:00:00Z"
  }
]
```

### Get My Orders (Farmer)
```
GET /orders/farmer/all
Authorization: Bearer <token>

Response 200:
[
  {
    "orderId": "ORDER-xxx",
    "consumerName": "Amit",
    "consumerPhone": "9876543212",
    "consumerEmail": "consumer1@example.com",
    "cropName": "Tomato",
    "quantity": 5,
    "totalPrice": 250.00,
    "status": "pending",
    "createdAt": "2024-03-28T10:00:00Z"
  }
]
```

### Track Order
```
GET /orders/track/:orderId
Authorization: Bearer <token>

Response 200:
{
  "order": { ... },
  "transport": {
    "id": 1,
    "status": "in_transit",
    "transporterName": "Raj Transporter",
    "transporterPhone": "9876543214",
    "currentLatitude": 17.3850,
    "currentLongitude": 78.4867,
    "deliveryLocation": "123 Main Street",
    "createdAt": "2024-03-28T10:05:00Z"
  },
  "blockchainHistory": [ ... ]
}
```

### Get QR Code
```
GET /orders/qr/:orderId

Response 200:
{
  "qrCode": "/qr-codes/ORDER-xxx.png",
  "supplyChain": {
    "orderId": "ORDER-xxx",
    "farmerName": "Ramesh Farmer",
    "farmerPhone": "9876543210",
    "consumerName": "Amit",
    "status": "pending",
    "delivery": "123 Main Street",
    "blockchainHistory": [ ... ]
  }
}
```

### Assign Transporter (Farmer Only)
```
POST /orders/assign-transporter
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "ORDER-xxx",
  "transporterId": 5
}

Response 200:
{
  "success": true,
  "message": "Transporter assigned"
}
```

---

## 🚚 Transport Endpoints

### Get My Deliveries (Transporter Only)
```
GET /transport/deliveries
Authorization: Bearer <token>

Response 200:
[
  {
    "id": 1,
    "orderId": "ORDER-xxx",
    "cropName": "Tomato",
    "consumerName": "Amit",
    "consumerPhone": "9876543212",
    "pickupLocation": "9876543210",
    "deliveryLocation": "123 Main Street",
    "status": "assigned",
    "createdAt": "2024-03-28T10:05:00Z"
  }
]
```

### Get Delivery Details (Transporter Only)
```
GET /transport/:transportId
Authorization: Bearer <token>

Response 200:
{
  "id": 1,
  "orderId": "ORDER-xxx",
  "status": "in_transit",
  "transporterName": "Raj",
  "transporterPhone": "9876543214",
  "transporterEmail": "transporter1@example.com",
  "currentLocation": "On the way",
  "currentLatitude": 17.3850,
  "currentLongitude": 78.4867,
  "deliveryLocation": "123 Main Street"
}
```

### Update Delivery Status (Transporter Only)
```
PUT /transport/:transportId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_transit",  // picked, in_transit, completed
  "latitude": 17.3850,
  "longitude": 78.4867
}

Response 200:
{
  "success": true,
  "message": "Delivery status updated"
}
```

### Update Location (Transporter Only)
```
PUT /transport/:transportId/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 17.3900,
  "longitude": 78.4900
}

Response 200:
{
  "success": true,
  "message": "Location updated"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Error Responses

```json
{
  "error": "Error message here"
}
```

Common errors:
- `"Email already registered"`
- `"Invalid credentials"`
- `"Insufficient quantity"`
- `"Unauthorized for this role"`
- `"Product not found"`

---

## Rate Limiting
No built-in rate limiting. Implement in production.

## CORS
Enabled for all origins in development.

## Testing
Use Postman or cURL to test endpoints:
```bash
curl -X GET http://localhost:5000/api/products/all
```
