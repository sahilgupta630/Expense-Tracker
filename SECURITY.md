# 🔒 Security Guidelines

## Environment Variables

**NEVER commit `.env` files to Git!** They contain sensitive credentials.

### Setup Instructions:

1. **Copy the example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` with your actual credentials:**
   - Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB credentials
   - Change `JWT_SECRET` to a random, secure string
   - Update other configuration as needed

3. **Verify `.env` is in `.gitignore`:**
   ```bash
   cat ../.gitignore | grep .env
   ```

## What to Keep Secret

### ❌ NEVER commit these:
- MongoDB connection strings with credentials
- JWT secrets
- API keys
- Passwords
- Private keys (`.pem`, `.key` files)
- Any `.env` files

### ✅ Safe to commit:
- `.env.example` (template with placeholders)
- Documentation with placeholder values
- Public configuration

## If You Accidentally Exposed Secrets

If you've already pushed secrets to GitHub:

1. **Immediately rotate/change the exposed credentials:**
   - MongoDB: Create a new database user with a new password
   - JWT: Generate a new secret key
   - API Keys: Regenerate them

2. **Remove from Git history:**
   ```bash
   # This will rewrite history - use with caution!
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: This rewrites history)
   git push origin --force --all
   ```

3. **Simpler approach - Start fresh:**
   ```bash
   # Remove Git history
   rm -rf .git
   
   # Initialize new repository
   git init
   git add .
   git commit -m "Initial commit with sanitized files"
   
   # Force push to GitHub
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main --force
   ```

## GitHub Secret Scanning

GitHub automatically scans for exposed secrets. If you receive an alert:

1. **Take it seriously** - Assume the secret is compromised
2. **Rotate the credential immediately**
3. **Remove it from your repository**
4. **Review your security practices**

## Best Practices

1. ✅ Always use `.env` files for sensitive data
2. ✅ Keep `.env` in `.gitignore`
3. ✅ Provide `.env.example` with placeholders
4. ✅ Use strong, unique passwords
5. ✅ Rotate credentials regularly
6. ✅ Use environment variables in production
7. ✅ Enable 2FA on your MongoDB Atlas account
8. ✅ Restrict IP access in MongoDB Atlas when possible

## Questions?

If you're unsure whether something should be committed, **don't commit it**. Ask first!
