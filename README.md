# 💰 MERN Stack Expense Tracker

A production-ready, full-stack expense tracking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Track your income and expenses with beautiful charts, emoji icons, and Excel export functionality.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)

## ✨ Features

### 🔐 Authentication
- **JWT-based authentication** with secure password hashing (bcrypt)
- User signup with profile image support
- Persistent login sessions

### 📊 Dashboard
- **Financial Overview**: Real-time summary cards showing Total Balance, Income, and Expenses
- **Interactive Charts**:
  - Pie Chart: Financial distribution (Balance vs Income vs Expense)
  - Bar Chart: Spending trends for the last 30 days
  - Pie Chart: Income sources breakdown (last 60 days)
- **Recent Transactions**: Mixed view of latest income and expense activities

### 💵 Income Management
- Add income entries with emoji icons, source, amount, and date
- **Bar Chart**: Track earnings over time
- View all income transactions with delete functionality
- **Export to Excel**: Download all income data

### 💸 Expense Management
- Add expense entries with emoji icons, category, amount, and date
- **Line Chart**: Monitor spending patterns
- View all expense transactions with delete functionality
- **Export to Excel**: Download all expense data

### 🎨 UI/UX Features
- **Modern Dark Theme** with glassmorphism effects
- **Emoji Picker** for transaction icons
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Toast Notifications**: Real-time feedback for all actions
- **Smooth Animations**: Premium micro-interactions throughout
- **Collapsible Sidebar**: Mobile-friendly navigation

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router DOM** for navigation
- **Recharts** for data visualization
- **Axios** for API requests
- **Emoji Picker React** for icon selection
- **React Toastify** for notifications
- **CSS3** with custom design system

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **XLSX** for Excel export
- **CORS** enabled

## 📁 Project Structure

```
expenseTracker-2/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── incomeController.js   # Income CRUD operations
│   │   └── expenseController.js  # Expense CRUD operations
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Income.js             # Income schema
│   │   └── Expense.js            # Expense schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── incomeRoutes.js       # Income endpoints
│   │   └── expenseRoutes.js      # Expense endpoints
│   ├── utils/
│   │   └── generateToken.js      # JWT token generator
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx        # Main layout wrapper
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   ├── TransactionModal.jsx  # Add transaction modal
│   │   │   ├── TransactionCard.jsx   # Transaction display card
│   │   │   └── ProtectedRoute.jsx    # Route guard
│   │   ├── context/
│   │   │   └── GlobalContext.jsx # Global state management
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Signup.jsx        # Signup page
│   │   │   ├── Dashboard.jsx     # Dashboard with charts
│   │   │   ├── Incomes.jsx       # Income management
│   │   │   └── Expenses.jsx      # Expense management
│   │   ├── utils/
│   │   │   └── api.js            # Axios configuration
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── .env                      # Environment variables
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd expenseTracker-2
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Configure Backend Environment**
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. **Setup Frontend**
```bash
cd ../frontend
npm install
```

5. **Configure Frontend Environment**
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Running the Application

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start Backend Server**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

3. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

4. **Access the Application**
Open your browser and navigate to `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (Protected)

### Income
- `POST /api/v1/income/add` - Add new income (Protected)
- `GET /api/v1/income/get` - Get all incomes (Protected)
- `DELETE /api/v1/income/delete/:id` - Delete income (Protected)
- `GET /api/v1/income/download` - Download incomes as Excel (Protected)

### Expense
- `POST /api/v1/expense/add` - Add new expense (Protected)
- `GET /api/v1/expense/get` - Get all expenses (Protected)
- `DELETE /api/v1/expense/delete/:id` - Delete expense (Protected)
- `GET /api/v1/expense/download` - Download expenses as Excel (Protected)

## 🎨 Design System

### Color Palette
- **Primary**: `hsl(262, 83%, 58%)` - Vibrant purple
- **Secondary**: `hsl(195, 100%, 50%)` - Bright cyan
- **Success**: `hsl(142, 76%, 36%)` - Green for income
- **Danger**: `hsl(0, 84%, 60%)` - Red for expenses
- **Background**: Dark theme with gradient overlays

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 700-800 weight
- **Body**: 400-500 weight

### Effects
- Glassmorphism with backdrop blur
- Smooth transitions (150ms-350ms)
- Hover animations and micro-interactions
- Box shadows with glow effects

## 📱 Responsive Breakpoints
- **Desktop**: > 768px
- **Mobile**: ≤ 768px

## 🔒 Security Features
- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with 30-day expiration
- Protected API routes with middleware
- CORS enabled for cross-origin requests
- Input validation on both frontend and backend

## 🧪 Testing the Application

### Sample User Flow
1. **Sign Up**: Create an account with name, email, password, and optional profile image
2. **Login**: Access your dashboard
3. **Add Income**: Click "Add Income" → Select emoji → Enter source, amount, date
4. **Add Expense**: Click "Add Expense" → Select emoji → Enter category, amount, date
5. **View Dashboard**: See financial overview with charts
6. **Export Data**: Download income/expense data as Excel files
7. **Delete Transactions**: Hover over transaction cards and click delete icon

## 🚀 Production Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is updated
3. Deploy the `backend` directory

### Frontend Deployment (e.g., Vercel, Netlify)
1. Update `VITE_API_URL` to your production backend URL
2. Build the frontend: `npm run build`
3. Deploy the `dist` folder

## 📝 Future Enhancements
- [ ] Budget planning and alerts
- [ ] Recurring transactions
- [ ] Category management
- [ ] Multi-currency support
- [ ] Data visualization filters (date ranges)
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Dark/Light theme toggle


