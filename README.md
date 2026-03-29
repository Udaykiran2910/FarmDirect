# 🌾 FarmDirect - Blockchain Farm-to-Consumer Supply Chain Platform

A modern, production-ready web application connecting farmers, transporters, and consumers with blockchain transparency and QR tracking.

## 🚀 Features

### Multi-Role System
- **Farmers**: List crops, receive orders, assign transporters
- **Consumers**: Browse products, place orders, track delivery
- **Transporters**: Accept deliveries, update status, track location

### Blockchain Integration
- Tamper-proof supply chain records
- Real-time transaction history
- Cryptographic hash verification

### QR Code System
- Generate QR for each order
- Scan to view complete supply chain
- Blockchain validation

### Multi-Language Support
- English 🇬🇧
- Telugu 🇮🇳
- Hindi 🇮🇳

### Modern UI/UX
- Amazon-style product browsing
- Responsive design
- Real-time updates
- GPS location tracking

## 📋 Tech Stack

- **Frontend**: React.js with Context API
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Blockchain**: Custom hash-based blockchain
- **QR Code**: qrcode library
- **Maps**: Google Maps API ready

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git

### 1. Database Setup

```bash
# Open MySQL command line or workbench
mysql -u root -p

# Run the schema file
source database/schema.sql

# Optional: Load sample data
source database/sample-data.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure .env file (edit with your settings)
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=farm_supply_chain
# JWT_SECRET=your_secret_key
# PORT=5000

# Start the backend server
npm run dev
# or for production
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will open on `http://localhost:3000`

## 📱 User Roles & Credentials

### Test Accounts (from sample data)

**Farmer**
- Email: `farmer1@example.com`
- Password: `password123`

**Consumer**
- Email: `consumer1@example.com`
- Password: `password123`

**Transporter**
- Email: `transporter1@example.com`
- Password: `password123`

## 🎯 Key Features Explained

### 1. User Authentication
- Unified login/register for all roles
- JWT token-based authentication
- Multi-role support per user
- Profile management

### 2. Product Management (Farmer)
- Add/edit/delete crops
- Track stock quantity
- Set dynamic pricing
- Add product descriptions

### 3. Order Management (Consumer)
- Browse all products with filters
- Add to cart functionality
- Real-time stock checking
- Order history tracking

### 4. Delivery Tracking (Transporter)
- Assign deliveries
- Update delivery status
- GPS location tracking
- Real-time communication

### 5. Blockchain Integrity
- Each order creates a blockchain block
- Immutable record storage
- Chain validation
- Full transparency

### 6. QR Code System
- Unique QR per order
- Embed full supply chain data
- Scan verification
- Download capability

## 🗂️ Project Structure

```
farmer/
├── backend/
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth, error handling
│   ├── blockchain/           # Blockchain implementation
│   ├── utils/                # Helper functions
│   ├── config/               # Database config
│   ├── server.js             # Main server file
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── context/          # React Context
│   │   ├── i18n/             # Language files
│   │   ├── styles/           # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .gitignore
│
└── database/
    ├── schema.sql            # Database schema
    └── sample-data.sql       # Sample data
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/profile           - Get user profile
PUT    /api/auth/profile           - Update profile
POST   /api/auth/switch-role       - Switch user role
```

### Products
```
POST   /api/products               - Add product (Farmer)
GET    /api/products/all           - Browse all products
GET    /api/products/:productId    - Get product details
GET    /api/products/farmer        - Get farmer's products
PUT    /api/products/:productId    - Update product (Farmer)
DELETE /api/products/:productId    - Delete product (Farmer)
```

### Orders
```
POST   /api/orders                 - Place order (Consumer)
GET    /api/orders/:orderId        - Get order details
GET    /api/orders/consumer/all    - Get consumer's orders
GET    /api/orders/farmer/all      - Get farmer's orders
GET    /api/orders/track/:orderId  - Track order
GET    /api/orders/qr/:orderId     - Get QR code
POST   /api/orders/assign-transporter - Assign transporter (Farmer)
```

### Transport
```
GET    /api/transport/deliveries   - Get transporter's deliveries
GET    /api/transport/:transportId - Get delivery details
PUT    /api/transport/:transportId/status   - Update status
PUT    /api/transport/:transportId/location - Update location
```

## 🎨 Key Components

### Frontend Components
- **Navbar**: Navigation, role switching, language selection
- **ProductCard**: Product display in grid
- **OrderForm**: Order placement form
- **TrackingTimeline**: Supply chain visualization

### Pages
- **Login/Register**: Authentication
- **Home**: Product browsing
- **ConsumerDashboard**: My orders, cart
- **FarmerDashboard**: My products, orders received
- **TransporterDashboard**: Assigned deliveries
- **ProductDetail**: Full product information
- **TrackOrder**: Real-time tracking
- **ScanQR**: QR scanning results

## 🔐 Security Features

- JWT token authentication
- Password hashing (bcryptjs)
- Role-based access control
- SQL injection prevention
- CORS enabled
- Environment variables for secrets

## 📊 Database Schema

### Key Tables
- **users**: User accounts with roles
- **user_roles**: Multi-role support
- **products**: Farmer's crops
- **orders**: Placed orders
- **transport**: Delivery details
- **blockchain_records**: Immutable chain records

## 🚀 Deployment

### Backend Deployment (Heroku/Render)
```bash
# Push to git then deploy using platform's CLI
npm run build  # if applicable
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the 'build' folder
```

### Database
- Use managed MySQL service (AWS RDS, Digital Ocean Managed MySQL)
- Ensure proper backups

## 🐛 Troubleshooting

### Can't connect to database?
- Check MySQL is running
- Verify .env database credentials
- Check user permissions

### Frontend can't reach backend?
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API_URL in service calls

### QR codes not generating?
- Check node_modules installation
- Verify qrcode package is installed
- Check file write permissions

### Permission denied errors?
- Check database user privileges
- Verify file ownership
- Check directory permissions

## 📝 Sample Data Instructions

After running schema.sql, you have:
- 2 Farmers with sample products
- 2 Consumers
- 2 Transporters
- Sample orders and transport records

All sample accounts use password: `password123`

## 🎓 Learning Resources

- Blockchain concepts
- React Context API
- Express.js middleware
- MySQL transactions
- JWT authentication

## 📞 Support & Issues

For issues or improvements, please:
1. Check existing documentation
2. Review API logs in terminal
3. Enable debug mode in frontend
4. Check database transaction logs

## 📄 License

Copyright 2024 - FarmDirect Platform

## 🙏 Acknowledgments

Built with ❤️ for farmers, consumers, and transparent supply chains.

---

**Happy Farming! 🌾**
