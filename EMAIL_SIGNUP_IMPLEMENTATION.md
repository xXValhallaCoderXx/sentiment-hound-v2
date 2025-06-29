# Email/Password Sign-Up Logic Implementation

**Document ID**: SH-PRD-012 Implementation  
**Author**: Development Team  
**Status**: Completed  
**Date**: Implementation Date  
**Target Feature**: Email/Password Account Creation Logic

## Overview

This document describes the implementation of the refactored email/password sign-up logic with invitation-only controls for the private alpha phase. The implementation introduces a feature flag `SIGNUPS_REQUIRE_INVITATION` that controls whether invitation tokens are mandatory for account creation.

## Implementation Summary

### ✅ **Completed Objectives**

1. **Feature Flag Implementation**: Added `SIGNUPS_REQUIRE_INVITATION` environment variable
2. **Conditional Logic**: Implemented invitation requirement based on feature flag
3. **Security Enhancement**: Maintained secure password hashing and validation
4. **Automatic Authentication**: Preserved post-creation sign-in functionality
5. **Error Handling**: Comprehensive error responses for all scenarios

### ✅ **Code Analysis Results**

**Located Files**:
- **Server Action**: `apps/web/actions/auth.actions.ts` - `handleEmailSignUp` function
- **Service Integration**: Uses existing `invitationTokenService` from `@repo/services`
- **Form Integration**: Connected via `AuthModal.tsx` component

**No new files required** - Successfully refactored existing implementation.

## Technical Implementation

### Environment Variable Configuration

**Development Environment** (`.env` files):
```env
# Feature Flags
SIGNUPS_REQUIRE_INVITATION=true
```

**Production Environment** (Railway):
```env
SIGNUPS_REQUIRE_INVITATION=true  # For alpha phase
```

### Refactored Logic Flow

The `handleEmailSignUp` function now follows this precise order:

#### **Step A: Read Form Data**
```typescript
const rawData = {
  email: formData.get("email") as string,
  password: formData.get("password") as string,
  name: formData.get("name") as string,
  invitationToken: formData.get("invitationToken") as string,
};

const validatedData = signUpSchema.parse(rawData);
```

#### **Step B: Conditional Token Validation (Feature Flag)**
```typescript
const requiresInvitation = process.env.SIGNUPS_REQUIRE_INVITATION === 'true';

if (requiresInvitation) {
  // Mandatory token validation
  if (!validatedData.invitationToken || validatedData.invitationToken.trim() === "") {
    return { error: "A valid invitation token is required." };
  }
  
  const tokenValidation = await invitationTokenService.consumeInvitationToken(
    validatedData.invitationToken,
    "pending-user"
  );
  
  if (!tokenValidation.isValid) {
    return { error: tokenValidation.error || "A valid invitation token is required." };
  }
} else {
  // Optional token validation
  // Token processed if provided, ignored if invalid
}
```

#### **Step C: User Existence Check**
```typescript
const existingUser = await prisma.user.findUnique({
  where: { email: validatedData.email },
});

if (existingUser) {
  return { error: "An account with this email already exists. Please sign in." };
}
```

#### **Step D: Password Hashing**
```typescript
const hashedPassword = await bcrypt.hash(validatedData.password, 12);
```

#### **Step E: User Creation**
```typescript
const user = await prisma.user.create({
  data: {
    email: validatedData.email,
    password: hashedPassword,
    name: validatedData.name || null,
    planId, // From invitation token or trial plan
  },
});
```

#### **Step F: Post-Creation Sign-In**
```typescript
const result = await signIn("credentials", {
  email: validatedData.email,
  password: validatedData.password,
  redirect: false,
});

if (result?.error) {
  return { error: "Failed to sign in after registration. Please try signing in manually." };
}

redirect("/dashboard");
```

## Acceptance Criteria Verification

### ✅ **AC1: Environment Variable Control**
- **Implementation**: `process.env.SIGNUPS_REQUIRE_INVITATION === 'true'` check
- **Status**: ✅ Completed
- **Test**: Variable controls logic flow in both true/false states

### ✅ **AC2: Flag True - No Token Fails**
- **Implementation**: Mandatory token validation when flag is true
- **Status**: ✅ Completed
- **Error Message**: "A valid invitation token is required."

### ✅ **AC3: Flag True - Valid Token Succeeds**
- **Implementation**: Token validation and consumption via `invitationTokenService`
- **Status**: ✅ Completed
- **Result**: User created with plan from invitation token

### ✅ **AC4: Flag False - No Token Succeeds**
- **Implementation**: Optional token logic, defaults to trial plan
- **Status**: ✅ Completed
- **Result**: User created with trial plan

### ✅ **AC5: Automatic Authentication**
- **Implementation**: NextAuth `signIn()` called after user creation
- **Status**: ✅ Completed
- **Result**: User automatically signed in and redirected to dashboard

### ✅ **AC6: Duplicate Email Handling**
- **Implementation**: Database query before user creation
- **Status**: ✅ Completed
- **Error Message**: "An account with this email already exists. Please sign in."

## Security Features

### **Password Security**
- **Hashing**: bcrypt with 12 salt rounds
- **Storage**: Only hashed passwords stored in database
- **Validation**: Minimum 8 character requirement via Zod schema

### **Token Security**
- **Consumption**: Tokens marked as "USED" after successful redemption
- **Expiration**: Automatic expiration date validation
- **Prevention**: Prevents token reuse and replay attacks

### **Input Validation**
- **Schema**: Zod validation for all form inputs
- **Email**: Format validation and uniqueness check
- **Sanitization**: Automatic input sanitization via Prisma

## Database Operations

### **User Creation Transaction**
1. **Existence Check**: `prisma.user.findUnique()` by email
2. **Token Validation**: `invitationTokenService.consumeInvitationToken()`
3. **User Creation**: `prisma.user.create()` with hashed password
4. **Token Update**: `prisma.invitationToken.updateMany()` with actual user ID

### **Plan Assignment Logic**
- **With Valid Token**: User assigned to plan specified in invitation token
- **Without Token**: User assigned to default trial plan
- **Fallback**: Trial plan used if token plan lookup fails

## Testing Strategy

### **Manual Testing Scenarios**

#### **Scenario 1: Invitation Required (SIGNUPS_REQUIRE_INVITATION=true)**
```bash
# Test without token
curl -X POST /api/signup \
  -d "email=test@example.com&password=password123"
# Expected: Error "A valid invitation token is required."

# Test with invalid token
curl -X POST /api/signup \
  -d "email=test@example.com&password=password123&invitationToken=invalid"
# Expected: Error "A valid invitation token is required."

# Test with valid token
curl -X POST /api/signup \
  -d "email=test@example.com&password=password123&invitationToken=valid_token"
# Expected: Success, user created and signed in
```

#### **Scenario 2: Invitation Optional (SIGNUPS_REQUIRE_INVITATION=false)**
```bash
# Test without token
curl -X POST /api/signup \
  -d "email=test@example.com&password=password123"
# Expected: Success, user created with trial plan

# Test with valid token
curl -X POST /api/signup \
  -d "email=test@example.com&password=password123&invitationToken=valid_token"
# Expected: Success, user created with token plan
```

#### **Scenario 3: Edge Cases**
```bash
# Test duplicate email
curl -X POST /api/signup \
  -d "email=existing@example.com&password=password123"
# Expected: Error "An account with this email already exists. Please sign in."

# Test invalid email format
curl -X POST /api/signup \
  -d "email=invalid-email&password=password123"
# Expected: Validation error

# Test short password
curl -X POST /api/signup \
  -d "email=test@example.com&password=123"
# Expected: "Password must be at least 8 characters long"
```

### **Automated Testing**
Run the test script to verify implementation:
```bash
node test-email-signup-logic.js
```

## Deployment Configuration

### **Alpha Phase (Current)**
```env
SIGNUPS_REQUIRE_INVITATION=true
```
- Restricts signups to invitation holders only
- Maintains exclusivity during private alpha
- Allows controlled user onboarding

### **Public Launch (Future)**
```env
SIGNUPS_REQUIRE_INVITATION=false
```
- Enables public signups without invitations
- Invitation tokens still work for special plans
- Seamless transition from private to public

## Error Handling

### **Validation Errors**
- **Email Format**: "Please enter a valid email address"
- **Password Length**: "Password must be at least 8 characters long"
- **Required Fields**: Field-specific validation messages

### **Business Logic Errors**
- **Missing Token**: "A valid invitation token is required."
- **Invalid Token**: Token-specific error from `invitationTokenService`
- **Duplicate Email**: "An account with this email already exists. Please sign in."
- **Sign-in Failure**: "Failed to sign in after registration. Please try signing in manually."

### **System Errors**
- **Database Errors**: "An unexpected error occurred. Please try again."
- **Network Errors**: Graceful fallback with retry suggestions

## Integration Points

### **Frontend Integration**
- **Component**: `AuthModal.tsx` uses `useActionState(handleEmailSignUp, null)`
- **Form Fields**: email, password, name, invitationToken (hidden)
- **Error Display**: Structured error responses displayed to user

### **Backend Services**
- **Invitation Service**: `invitationTokenService.consumeInvitationToken()`
- **Authentication**: NextAuth `signIn()` with credentials provider
- **Database**: Prisma client for user and token operations

### **External Dependencies**
- **bcrypt**: Password hashing (v2.4.3+)
- **zod**: Input validation (v3.25.56+)
- **NextAuth**: Authentication management (v5.0.0-beta.25)

## Future Enhancements

### **Planned Improvements**
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] Rate limiting for signup attempts
- [ ] Audit logging for security events
- [ ] Multi-factor authentication support

### **Monitoring & Analytics**
- [ ] Signup conversion tracking
- [ ] Invitation token usage analytics
- [ ] Error rate monitoring
- [ ] Performance metrics collection

## Conclusion

The email/password sign-up logic has been successfully refactored according to PRD SH-PRD-012 specifications. The implementation provides:

- ✅ **Feature Flag Control**: `SIGNUPS_REQUIRE_INVITATION` environment variable
- ✅ **Secure Implementation**: bcrypt password hashing, input validation
- ✅ **Flexible Logic**: Supports both invitation-required and open signup modes
- ✅ **Comprehensive Error Handling**: Clear error messages for all scenarios
- ✅ **Automatic Authentication**: Seamless post-registration sign-in
- ✅ **Production Ready**: Suitable for alpha phase deployment

The implementation is ready for production deployment with the feature flag set to `true` for the private alpha phase, and can be easily switched to `false` for public launch.