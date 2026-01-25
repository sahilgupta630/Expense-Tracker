# ⚠️ IMPORTANT: Credential Rotation Required

## 🚨 Action Required Immediately

GitHub detected that MongoDB credentials were exposed in your repository. Even though we've removed them from the current code, **you MUST rotate (change) your credentials** because:

1. The secrets were publicly visible (even briefly)
2. Git history may have been cached by GitHub or other services
3. Bots scan GitHub for exposed credentials within minutes

---

## ✅ Step-by-Step Fix

### 1. **Change Your MongoDB Password (CRITICAL)**

#### If using MongoDB Atlas:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Click **"Database Access"** in the left sidebar
4. Find your database user (e.g., `expenseuser`)
5. Click **"Edit"**
6. Click **"Edit Password"**
7. Generate a **new strong password** (or create your own)
8. Click **"Update User"**
9. **Copy the new password** - you'll need it!

#### Alternative - Create a New User:
1. Go to **"Database Access"**
2. Click **"Add New Database User"**
3. Create a **new username** (different from before)
4. Set a **strong password**
5. Set privileges to "Atlas admin"
6. Click **"Add User"**
7. **Delete the old user** to revoke the exposed credentials

---

### 2. **Update Your Local .env File**

1. Open `backend/.env` in your project
2. Update with your **new credentials**:
   ```env
   MONGODB_URI=mongodb+srv://NEW_USERNAME:NEW_PASSWORD@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
   JWT_SECRET=generate_a_new_random_secret_key_here
   ```

3. **Generate a new JWT secret:**
   ```bash
   # Run this in PowerShell to generate a random secret:
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
   ```

---

### 3. **Verify .env is NOT Tracked by Git**

```bash
# Check if .env is ignored
git status

# You should NOT see backend/.env in the output
# If you do, run:
git rm --cached backend/.env
git commit -m "Remove .env from tracking"
git push
```

---

### 4. **Dismiss GitHub Security Alerts**

After rotating your credentials:

1. Go to your repository: https://github.com/sahilgupta630/Expenser-Tracker
2. Click **"Security"** tab
3. Click **"Secret scanning alerts"**
4. For each alert:
   - Click on the alert
   - Click **"Dismiss alert"**
   - Select **"Revoked"** as the reason
   - Add comment: "Credentials rotated and removed from repository"
   - Click **"Dismiss alert"**

---

## 📋 What We Fixed

✅ **Sanitized `MONGODB_SETUP.md`** - Removed example credentials, replaced with placeholders  
✅ **Enhanced `.gitignore`** - Added comprehensive rules to prevent future leaks  
✅ **Created `SECURITY.md`** - Security guidelines and best practices  
✅ **Removed secrets from Git history** - Force pushed sanitized version  
✅ **`.env.example` exists** - Template file with placeholders  

---

## 🔐 Security Best Practices Going Forward

1. ✅ **NEVER commit `.env` files** - They're in `.gitignore` now
2. ✅ **Use placeholders in documentation** - Like `YOUR_USERNAME`, `YOUR_PASSWORD`
3. ✅ **Rotate credentials regularly** - Change passwords every few months
4. ✅ **Enable 2FA** - On GitHub and MongoDB Atlas
5. ✅ **Review before committing** - Run `git diff` before `git commit`
6. ✅ **Use `.env.example`** - Provide templates, never real credentials

---

## 🆘 Need Help?

If you're unsure about any step, **STOP** and ask for help. Better safe than sorry!

---

## ✅ Checklist

- [ ] MongoDB password changed/rotated
- [ ] Local `backend/.env` updated with new credentials
- [ ] New JWT secret generated and added to `.env`
- [ ] Verified `.env` is not tracked by Git (`git status`)
- [ ] GitHub security alerts dismissed
- [ ] Tested that the app still works with new credentials

---

**Once you complete these steps, your repository will be secure!** 🎉
