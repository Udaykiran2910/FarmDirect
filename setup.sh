#!/bin/bash
# FarmDirect Setup Script

echo "🌾 FarmDirect - Blockchain Farm-to-Consumer Supply Chain"
echo "=========================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend
npm install

if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=farm_supply_chain
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
EOF
    echo "✅ .env template created. Please update with your database credentials."
fi

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend setup complete!"
echo ""

# Database Setup Instructions
echo "=========================================================="
echo "📊 DATABASE SETUP INSTRUCTIONS"
echo "=========================================================="
echo ""
echo "1. Make sure MySQL Server is running"
echo "2. Open MySQL client:"
echo "   mysql -u root -p"
echo ""
echo "3. Run the schema file:"
echo "   source database/schema.sql"
echo ""
echo "4. Optional - Load sample data:"
echo "   source database/sample-data.sql"
echo ""

echo "=========================================================="
echo "🚀 STARTING THE APPLICATION"
echo "=========================================================="
echo ""
echo "1. Terminal 1 - Start Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Terminal 2 - Start Frontend:"
echo "   cd frontend && npm start"
echo ""
echo "3. Open browser: http://localhost:3000"
echo ""

echo "=========================================================="
echo "✅ Setup Complete! Happy Farming! 🌾"
echo "=========================================================="
