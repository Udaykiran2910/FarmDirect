# 🚀 Quick Start Guide - FarmDirect

## 5-Minute Setup

### Step 1: Backend Setup (2 min)
```bash
cd backend
npm install
# Edit .env with your MySQL credentials
npm run dev
# ✅ Backend running on http://localhost:5000
```

### Step 2: Frontend Setup (2 min)
```bash
cd frontend
npm install
npm start
# ✅ Frontend opens on http://localhost:3000
```

### Step 3: Login (1 min)
Use these test accounts:
- **Farmer**: farmer1@example.com / password123
- **Consumer**: consumer1@example.com / password123
- **Transporter**: transporter1@example.com / password123

---

## First Time Using Each Role?

### 👨‍🌾 Farmer
1. Log in as farmer1@example.com
2. Go to Farmer Dashboard
3. Click "+ Add Product"
4. Fill crop details and submit
5. View your products in inventory
6. Receive orders from consumers

### 👤 Consumer
1. Log in as consumer1@example.com
2. Browse products on Home page
3. Search/filter by crop name or location
4. Click on a product card
5. Select quantity and delivery address
6. Click "Place Order"
7. Track order in real-time

### 🚚 Transporter
1. Log in as transporter1@example.com
2. Go to Transporter Dashboard
3. View "My Deliveries"
4. Click "Update Status" on any delivery
5. Select status: Picked → In Transit → Delivered
6. Enable GPS to share location
7. Confirm delivery

---

## Testing Features

### 🔄 Role Switching
- Use navbar dropdown to switch between roles
- No need to re-login
- Your context maintains all data

### 🌐 Language Switching
- Click language button (🌐) in navbar
- Select: English, తెలుగు, हिंदी
- Page translates instantly

### ⛓️ Blockchain Tracking
- Place an order as Consumer
- Each status update creates a new blockchain record
- View blockchain history in order tracking

### 📊 QR Code System
- After placing order, scan QR code
- Shows full supply chain transparency
- Displays farmer, transporter, delivery info
- View blockchain history

---

## Important Notes

### Database Setup
Must run schema.sql before starting backend:
```bash
mysql -u root -p farm_supply_chain < database/schema.sql
```

### Environment Variables (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=farm_supply_chain
JWT_SECRET=your_secret_key
```

### File Locations
```
Backend:    backend/server.js
Frontend:   frontend/src/App.js
Database:   database/schema.sql
Styles:     frontend/src/styles/
Languages:  frontend/src/i18n/
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# View logs
# Terminal will show all API calls and errors
```

---

## What's Included

✅ **Backend**
- 6 API resource modules
- JWT authentication
- Blockchain implementation
- QR code generation
- MySQL database

✅ **Frontend**
- 10+ React pages
- 3 role-specific dashboards
- Multi-language support
- Responsive design
- Real-time tracking

✅ **Database**
- Complete schema with 6 tables
- Sample data (12 users, 6 products)
- Indexes for performance

✅ **Features**
- User authentication & multi-role
- Product CRUD operations
- Order placement & tracking
- Real-time delivery status
- Blockchain transparency
- QR code generation & scanning

---

## Ports

- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000
- **MySQL**: localhost:3306

---

## Next Steps After Setup

1. **Explore as Farmer**
   - Add 2-3 products
   - See products on home page

2. **Explore as Consumer**
   - Browse products
   - Place 1-2 orders
   - Track orders in real-time

3. **Explore as Transporter**
   - Accept delivery requests
   - Update status progression
   - View blockchain updates

4. **Test All Features**
   - Role switching
   - Language switching
   - QR code scanning
   - Blockchain verification

---

## Need Help?

### Backend Issues?
```bash
# Check logs in terminal
# Verify .env database credentials
# Restart with: npm run dev
```

### Frontend Issues?
```bash
# Check browser console (F12)
# Clear cache: Ctrl+Shift+Del
# Restart with: npm start
```

### Database Issues?
```bash
# Start MySQL service
# Re-run schema: mysql < database/schema.sql
# Check user permissions
```

---

## Performance Tips

- Use filters to reduce product list
- Orders load faster with fewer status updates
- Blockchain verification is instant
- QR codes generate in <1 second

---

**Enjoy using FarmDirect! Happy farming 🌾**
