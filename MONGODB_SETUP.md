# 🗄️ MongoDB Setup Guide

## Current Issue
MongoDB is not installed on your system. You need to set up MongoDB to run this project.

---

## ✅ **RECOMMENDED: Option 2 - MongoDB Atlas (Cloud - FREE)**

This is the **easiest and fastest** option! No installation needed.

### **Step-by-Step Instructions:**

#### **1. Create Free MongoDB Atlas Account**
- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up (no credit card required)
- Verify your email

#### **2. Create a Free Cluster**
- Click "Build a Database"
- Choose **M0 FREE** tier
- Select AWS as provider
- Choose region closest to you (e.g., Mumbai for India)
- Cluster Name: Keep default or name it "ExpenseTracker"
- Click "Create Cluster" (wait 3-5 minutes)

#### **3. Create Database User**
- Click "Database Access" in left sidebar
- Click "Add New Database User"
- Authentication Method: Password
- Username: `expenseuser`
- Password: `expense123` (or create your own - remember it!)
- Database User Privileges: "Atlas admin"
- Click "Add User"

#### **4. Whitelist Your IP Address**
- Click "Network Access" in left sidebar
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

#### **5. Get Your Connection String**
- Click "Database" in left sidebar
- Click "Connect" button on your cluster
- Choose "Connect your application"
- Driver: Node.js
- Version: 5.5 or later
- Copy the connection string (looks like this):
  ```
  mongodb+srv://expenseuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

#### **6. Update Your Backend .env File**

Open `backend/.env` and replace the MongoDB URI:

**BEFORE:**
```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

**AFTER:**
```env
MONGODB_URI=mongodb+srv://expenseuser:expense123@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

**Important:** 
- Replace `<password>` with your actual password (e.g., `expense123`)
- Replace `xxxxx` with your actual cluster ID from the connection string
- Add `/expense-tracker` before the `?` to specify the database name

**Example:**
```env
MONGODB_URI=mongodb+srv://expenseuser:expense123@cluster0.abc123.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

#### **7. Start Your Project**

Now you can skip the `mongod` command and directly start your servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

✅ **That's it!** Your app will connect to MongoDB Atlas in the cloud.

---

## 🔧 **Alternative: Option 1 - Install MongoDB Locally**

If you prefer to run MongoDB on your computer:

### **For Windows:**

#### **1. Download MongoDB**
- Go to: https://www.mongodb.com/try/download/community
- Version: 7.0 or later
- Platform: Windows x64
- Package: MSI
- Click Download

#### **2. Install MongoDB**
- Run the `.msi` installer
- Choose "Complete" installation
- ✅ Check "Install MongoDB as a Service"
- ✅ Check "Install MongoDB Compass" (optional GUI)
- Click Install

#### **3. Verify Installation**
Open PowerShell and run:
```bash
mongod --version
```

You should see version information.

#### **4. Start MongoDB Service**

**Option A - Automatic (Recommended):**
MongoDB should start automatically as a Windows service.

**Option B - Manual Start:**
```bash
net start MongoDB
```

**Option C - Check Service:**
1. Press `Win + R`
2. Type `services.msc`
3. Find "MongoDB Server"
4. Right-click → Start

#### **5. Verify MongoDB is Running**
```bash
mongosh
```

If it connects, MongoDB is running!

#### **6. Keep .env as Default**
Your `backend/.env` should have:
```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

#### **7. Start Your Project**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🚀 **Quick Comparison**

| Feature | MongoDB Atlas (Cloud) | Local MongoDB |
|---------|----------------------|---------------|
| Installation | ❌ None needed | ✅ Required (~500MB) |
| Setup Time | 5 minutes | 10-15 minutes |
| Internet Required | ✅ Yes | ❌ No |
| Free Tier | ✅ 512MB storage | ✅ Unlimited |
| Best For | Quick start, deployment | Development, offline work |
| **Recommendation** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 💡 **My Recommendation**

**Use MongoDB Atlas (Cloud)** because:
1. ✅ No installation needed
2. ✅ Setup in 5 minutes
3. ✅ Free forever (512MB is plenty for this project)
4. ✅ Same connection string works when you deploy
5. ✅ Automatic backups
6. ✅ No maintenance required

---

## 🆘 **Troubleshooting**

### **Issue: Connection String Not Working**
- Make sure you replaced `<password>` with your actual password
- Check that you whitelisted your IP (0.0.0.0/0)
- Verify the database user was created

### **Issue: "Authentication Failed"**
- Double-check username and password in connection string
- Make sure there are no special characters in password (or URL-encode them)

### **Issue: "Network Error"**
- Check your internet connection
- Verify Network Access settings in Atlas
- Make sure firewall isn't blocking MongoDB

### **Issue: Local MongoDB Won't Start**
- Check if port 27017 is already in use
- Try running as Administrator
- Check Windows Services for MongoDB status

---

## ✅ **Next Steps After MongoDB Setup**

1. Start backend server: `cd backend && npm run dev`
2. Start frontend server: `cd frontend && npm run dev`
3. Open browser: http://localhost:5173
4. Create your first account!

---

**Need help?** Check the error messages and refer to this guide!
