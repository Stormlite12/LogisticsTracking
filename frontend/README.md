# Logistics Management System

A modern, multi-tenant logistics and transport management system built with React and Node.js.

## ✨ Features

- **Multi-Tenant Architecture** - Isolated data for each logistics company
- **Role-Based Access Control** - Customer, Driver, Admin, Super Admin roles
- **Load Management** - Post and track cargo shipments
- **Fleet Management** - Register and manage truck fleet
- **Booking System** - Admin assigns trucks to loads
- **PDF Generation** - Bilty and invoice generation //Being made
- **Real-time Status Tracking** - Track deliveries from pickup to completion

## 🛠️ Tech Stack

**Frontend:**
- React 19
- React Router DOM
- Axios
- Vite

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- PDFKit

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB


Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/fleet
ACCESS_TOKEN_SECRET=your-secret-key-here
PORT=10000
```

Start backend:
```bash
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:10000/api
```

Start frontend:
```bash
npm run dev
```

## 📖 User Roles

### Customer
- Post loads (cargo shipments)
- View bookings and delivery status
- Generate invoices

### Driver
- Register trucks
- View assigned loads
- Update delivery status

### Admin
- Match loads with trucks
- Create bookings
- Manage users
- Generate bilty and invoices

### Super Admin
- Manage all companies (tenants)
- View system logs
- Activate/deactivate companies

## 🗂️ Project Structure

```
Fleet/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── api/         # Axios config
│   └── index.html
└── README.md
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Loads
- `POST /api/load/post` - Post new load
- `GET /api/customer/loads` - Get customer's loads
- `GET /api/load/available` - Get available loads (admin)

### Trucks
- `POST /api/truck/post` - Register truck
- `GET /api/truck/available` - Get available trucks (admin)

### Bookings
- `POST /api/booking/assign` - Assign truck to load (admin)
- `GET /api/customer/bookings` - Get customer bookings
- `GET /api/driver/bookings` - Get driver bookings
- `PATCH /api/booking/:id/status` - Update booking status

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Multi-tenant data isolation

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Your Name - [Your Portfolio/LinkedIn]

---

Built with ❤️ using React & Node.js