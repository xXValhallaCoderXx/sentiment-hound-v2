# Invitation & Promotions Code System

This implementation provides a complete invitation code system that allows admins to generate special codes that grant users access to enhanced plans during signup.

## Features

### Core MVP Features ✅
- **Invitation Code Database Model**: Stores codes with plan assignment, usage tracking, and expiration
- **Code Validation**: Server-side validation with detailed error messages
- **Conditional Plan Assignment**: Users get assigned plans based on valid invitation codes
- **Email/Password Signup Support**: Manual code entry during signup
- **OAuth Signup Support**: URL-based codes with localStorage persistence
- **Admin Code Generation**: Command-line script for creating invitation codes
- **Usage Tracking**: Automatic increment of redemption count

### User Flows

#### Path A: Regular Signup (No Code)
1. User visits signup page without invitation code
2. User completes signup (email/password or OAuth)
3. User is assigned to "trial" plan (default)

#### Path B: Invitation Code Signup
1. User visits signup URL with code: `https://sentimenthound.com/signup?code=EARLYBIRD2025`
2. Code is detected and pre-filled/stored
3. User completes signup process
4. Code is validated and redeemed
5. User is assigned to specified plan (e.g., "developer")

### Database Schema

```prisma
model InvitationCode {
  id            String    @id @default(cuid())
  code          String    @unique
  isActive      Boolean   @default(true)
  
  // Plan assignment
  planId        Int?      
  plan          Plan?     @relation(fields: [planId], references: [id])
  
  // Future discount support
  discountType  String?   // 'PERCENT', 'FIXED_AMOUNT'
  discountValue Decimal?
  
  // Usage controls
  expiresAt     DateTime?
  maxUses       Int?
  timesUsed     Int       @default(0)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Plans

Added new "developer" plan for early testers:
- **Name**: developer
- **Features**: 5 integrations, 25 keywords, 5 competitors, 1M tokens
- **Special**: Beta features access, unlimited data lookback
- **Price**: Free (for invitation users)

## Usage

### Admin: Generate Invitation Codes

```bash
# Basic developer plan invitation
node scripts/generate-invitation-code.js EARLYBIRD2025 --plan=developer

# Limited use code
node scripts/generate-invitation-code.js BETA100 --plan=developer --max-uses=100

# Expiring code
node scripts/generate-invitation-code.js LAUNCH2025 --plan=developer --expires=2025-12-31

# Future: Discount code
node scripts/generate-invitation-code.js SAVE20 --plan=starter --discount-type=PERCENT --discount-value=20
```

### User: Redeem Invitation Codes

#### Method 1: Magic Link (Recommended)
1. Share URL: `https://sentimenthound.com/signup?code=EARLYBIRD2025`
2. User clicks link and signs up normally
3. Code is automatically applied

#### Method 2: Manual Entry
1. User opens signup modal
2. Clicks "Have an invitation code?" → "Add Code"
3. Enters code and clicks "Apply"
4. Completes signup process

### Developer: API Integration

```typescript
// Validate invitation code
const validation = await invitationCodeService.validateCode("EARLYBIRD2025");
if (validation.isValid) {
  // Code is valid, planId available
}

// Apply invitation code after OAuth
const response = await fetch("/api/invitation-codes/apply", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ invitationCode: "EARLYBIRD2025" })
});
```

## Technical Implementation

### Frontend Components

- **AuthModal**: Updated with collapsible invitation code field
- **InvitationCodeHandler**: Handles post-OAuth code application
- **Utility Functions**: URL parsing, localStorage management, validation

### Backend Services

- **InvitationCodeService**: Core business logic for code validation/redemption
- **Auth Actions**: Updated signup flow with code handling
- **API Routes**: `/api/invitation-codes/apply` for post-OAuth processing

### OAuth Flow Handling

1. **Pre-OAuth**: Code stored in localStorage before redirect
2. **Post-OAuth**: InvitationCodeHandler retrieves and applies stored code
3. **Cleanup**: Code cleared from storage after processing

## Security Considerations

- **Code Format Validation**: Alphanumeric with hyphens/underscores only
- **Server-Side Validation**: All code validation happens on server
- **Usage Limits**: Configurable max uses and expiration dates
- **Plan Restrictions**: Only allows upgrade from trial plan
- **Error Handling**: Graceful degradation if code fails

## Future Enhancements

- **Discount System**: Support for percentage/fixed amount discounts
- **Admin Dashboard**: Web interface for code management
- **Analytics**: Track code usage and conversion rates
- **Referral System**: Link codes to specific users for tracking
- **Bulk Generation**: Create multiple codes at once

## Testing

Run the test suite to verify all logic:

```bash
node test-invitation-codes.js
```

This validates:
- Code format validation
- URL parameter extraction  
- User flow scenarios
- OAuth localStorage flow
- Edge cases and error handling

## Deployment Checklist

1. **Database Migration**: Apply schema changes
   ```bash
   pnpm --filter @repo/db db:push
   ```

2. **Seed Data**: Add new developer plan
   ```bash
   pnpm --filter @repo/db db:seed
   ```

3. **Generate Test Codes**: Create initial invitation codes
   ```bash
   node scripts/generate-invitation-code.js EARLYBIRD2025 --plan=developer
   ```

4. **Environment Variables**: Ensure all auth providers configured

5. **Testing**: Verify both email and OAuth signup flows

## Acceptance Criteria Status

- ✅ Admin can generate unique invitation codes linked to plans
- ✅ Email/password signup with valid code assigns correct plan  
- ✅ OAuth signup with URL code assigns correct plan
- ✅ OAuth signup with manual code entry assigns correct plan
- ✅ Signup without code assigns default trial plan
- ✅ Invalid/expired codes show clear error messages
- ✅ Code usage count is properly incremented
- ✅ System is future-proofed for discount functionality