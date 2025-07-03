# ✅ Working Token Generation Guide

## 🎉 Success! Token Generation is Working

We've successfully set up token generation using the pnpm workspace context. Here's how to use it:

## 🚀 Quick Commands

### **Generate a Real Invitation Token**
```bash
# Method 1: Using pnpm filter (recommended)
pnpm --filter @repo/db exec node scripts/generate-token.mjs --plan=Developer

# Method 2: Using the npm script
pnpm --filter @repo/db generate-token --plan=Developer

# Method 3: Run from database package directory
cd packages/database
node scripts/generate-token.js --plan=Developer
```

### **Available Plans**
- `--plan=Developer` - Testing plan (1 integration)
- `--plan=Starter` - Small business plan (3 integrations, 3 keywords)
- `--plan=Pro` - Advanced plan (10 integrations, export features)
- `--plan=Trial` - Basic plan (no features)

### **Token Expiration Options**
```bash
# Token expires in 1 day
pnpm --filter @repo/db generate-token --plan=Developer --expires-in-days=1

# Token expires in 30 days
pnpm --filter @repo/db generate-token --plan=Developer --expires-in-days=30
```

## 📋 Complete Testing Workflow

### **Step 1: Start Database**
```bash
docker-compose up -d
```

### **Step 2: Seed Database**
```bash
pnpm turbo db:seed
```

### **Step 3: Generate Token**
```bash
pnpm --filter @repo/db generate-token --plan=Developer
```

**Example Output:**
```
📋 Generating token for plan: Developer
⏰ Token expires in: 7 days

🔧 Generating Invitation Token

✅ Successfully generated invitation token
   Token: 6b1b7scekhaKjgcvI1O9vcvmAyMgMFXB
   Plan: Developer (Developer plan for testing purposes)
   Expires: 7/7/2025

🔗 Test URLs:
   Local: http://localhost:3000/sign-up?token=6b1b7scekhaKjgcvI1O9vcvmAyMgMFXB
   Production: https://sentimenthound.com/sign-up?token=6b1b7scekhaKjgcvI1O9vcvmAyMgMFXB
```

### **Step 4: Start Development Server**
```bash
pnpm dev
```

### **Step 5: Test Signup**
Visit the generated local URL:
```
http://localhost:3000/sign-up?token=6b1b7scekhaKjgcvI1O9vcvmAyMgMFXB
```

## ✅ Expected Test Results

### **Form Behavior**
- ✅ Invitation code field pre-filled with token
- ✅ Field is readonly with lock icon
- ✅ Form accepts email, password, name inputs
- ✅ Submit button shows loading state

### **Successful Signup**
- ✅ User created in database
- ✅ User assigned to Developer plan
- ✅ User automatically signed in
- ✅ Redirected to /dashboard
- ✅ Token marked as USED in database

### **Error Handling**
- ✅ Invalid tokens show "failed to validate token"
- ✅ Duplicate emails show "account already exists"
- ✅ Used tokens show "already been used"
- ✅ Expired tokens show "has expired"

## 🔧 Troubleshooting

### **If Token Generation Fails**

**Database Connection Error:**
```bash
# Check if database is running
docker ps | grep postgres

# Start database if not running
docker-compose up -d

# Check DATABASE_URL in .env files
cat packages/database/.env
```

**Plan Not Found Error:**
```bash
# Seed the database to create plans
pnpm turbo db:seed

# Check available plans
pnpm --filter @repo/db generate-token --plan=InvalidPlan
# This will list available plans
```

### **If Signup Fails**

**Check Environment Variables:**
```bash
# Verify SIGNUPS_REQUIRE_INVITATION is set
grep SIGNUPS_REQUIRE_INVITATION apps/web/.env
```

**Check Server Logs:**
- Look for detailed error messages in terminal
- Check browser console for JavaScript errors
- Check network tab for 500 errors

## 🎯 Different Testing Scenarios

### **1. Valid Token Test**
```bash
# Generate token
pnpm --filter @repo/db generate-token --plan=Developer

# Use generated URL
# Fill form: test@example.com, password123
# Expected: Success, redirect to dashboard
```

### **2. Invalid Token Test**
```bash
# Visit with fake token
http://localhost:3000/sign-up?token=invalid123

# Fill form and submit
# Expected: "failed to validate token" error
```

### **3. Expired Token Test**
```bash
# Generate token that expires immediately
pnpm --filter @repo/db generate-token --plan=Developer --expires-in-days=0

# Wait a moment, then use token
# Expected: "token has expired" error
```

### **4. Used Token Test**
```bash
# Use same token twice
# First use: Success
# Second use: "already been used" error
```

### **5. Duplicate Email Test**
```bash
# Sign up with test@example.com
# Try to sign up again with same email
# Expected: "account already exists" error
```

## 📊 Database Verification

### **Check Generated Tokens**
```sql
SELECT token, status, "planToAssignId", "expiresAt", "createdAt" 
FROM "InvitationToken" 
ORDER BY "createdAt" DESC;
```

### **Check Created Users**
```sql
SELECT email, name, "planId", "createdAt" 
FROM "User" 
ORDER BY "createdAt" DESC;
```

### **Check Token Usage**
```sql
SELECT t.token, t.status, t."redeemedAt", u.email 
FROM "InvitationToken" t 
LEFT JOIN "User" u ON t."redeemedByUserId" = u.id 
ORDER BY t."createdAt" DESC;
```

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. **Token Generation**: Script outputs valid token and URLs
2. **Form Loading**: Signup page loads with pre-filled invitation code
3. **Form Submission**: Loading state appears, no console errors
4. **User Creation**: User appears in database with correct plan
5. **Authentication**: User automatically signed in
6. **Redirect**: User taken to dashboard
7. **Token Status**: Token marked as USED in database

## 🚀 Ready for Production

The token generation and signup flow is now fully functional! You can:

- Generate real invitation tokens for testing
- Test the complete signup flow end-to-end
- Verify error handling works correctly
- Confirm plan assignment is working
- Test both email/password and OAuth flows

The system is ready for the private alpha phase with invitation-only signups!

## 📝 Quick Reference

**Most Common Command:**
```bash
pnpm --filter @repo/db generate-token --plan=Developer
```

**Complete Test Sequence:**
```bash
docker-compose up -d
pnpm turbo db:seed
pnpm --filter @repo/db generate-token --plan=Developer
pnpm dev
# Visit generated URL and test signup
```

Happy testing! 🎉