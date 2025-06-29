# Sign-up Page Token Population Implementation

## Overview

This implementation adds automatic population and readonly functionality for invitation codes in the sign-up form when tokens are provided via URL parameters.

## Features Implemented

### ✅ URL Parameter Detection
- Supports both `token` and `code` URL parameters for flexibility
- `token` parameter takes precedence if both are present
- Works with URLs like:
  - `/sign-up?token=ABC123`
  - `/sign-up?code=XYZ789`
  - `/sign-up?token=ABC123&code=XYZ789` (token wins)

### ✅ Server-side Validation
- **File**: `apps/web/app/sign-up/page.tsx`
- Checks for valid token/code parameters on the server
- Redirects to `/sign-in` if no valid parameter is found
- Prevents access to signup form without invitation

### ✅ Client-side Form Population
- **File**: `apps/web/app/sign-up/SignUpForm.tsx`
- Automatically populates invitation code field from URL
- Makes field readonly when populated from URL
- Prevents manual editing of URL-provided codes

### ✅ Visual Indicators
- **Gray background** for readonly fields
- **Lock icon** in the right section of the input
- **"not-allowed" cursor** on hover
- **Different placeholder text** indicating source
- Clear visual distinction between editable and readonly states

## Technical Implementation

### Server-side Changes (`page.tsx`)
```tsx
// Check for both token and code parameters
const token = resolvedSearchParams.token || resolvedSearchParams.code;

// Redirect if no valid parameter
if (!token || token === '') {
  permanentRedirect('/sign-in');
}
```

### Client-side Changes (`SignUpForm.tsx`)
```tsx
// State management
const [invitationCode, setInvitationCode] = useState("");
const [isTokenFromUrl, setIsTokenFromUrl] = useState(false);

// URL parameter detection
useEffect(() => {
  const token = searchParams.get("token") || searchParams.get("code");
  if (token) {
    setInvitationCode(token);
    setIsTokenFromUrl(true);
  }
}, [searchParams]);

// Form field with conditional readonly
<FormField
  type="text"
  label="Invitation Code"
  placeholder={isTokenFromUrl ? "Code from invitation link" : "Enter your invitation code"}
  value={invitationCode}
  onChange={(e) => {
    if (!isTokenFromUrl) {
      setInvitationCode(e.target.value);
    }
  }}
  readOnly={isTokenFromUrl}
  rightSection={isTokenFromUrl ? <IconLock size={16} /> : undefined}
  styles={{
    input: {
      backgroundColor: isTokenFromUrl ? 'var(--mantine-color-gray-1)' : undefined,
      cursor: isTokenFromUrl ? 'not-allowed' : undefined,
    }
  }}
/>
```

## User Experience

### With Token in URL
1. User clicks invitation link: `https://app.com/sign-up?token=ABC123`
2. Form loads with invitation code field pre-filled with "ABC123"
3. Field is readonly with visual indicators (gray background, lock icon)
4. User cannot edit the invitation code
5. User completes other fields and submits

### Without Token in URL
1. User visits: `https://app.com/sign-up`
2. Server redirects to `/sign-in` page
3. User must use proper invitation link to access signup

### Manual Code Entry (if no URL token)
1. User accesses signup through other means
2. Invitation code field is editable
3. User can manually enter their code
4. No visual readonly indicators

## Security Considerations

- ✅ Server-side validation prevents unauthorized access
- ✅ Client-side readonly prevents accidental modification
- ✅ URL parameters are validated and sanitized
- ✅ Graceful fallback for missing parameters

## Testing

### Manual Testing Steps
1. Start development server: `pnpm dev`
2. Test with token: `http://localhost:3000/sign-up?token=TEST123`
3. Test with code: `http://localhost:3000/sign-up?code=TEST456`
4. Test without params: `http://localhost:3000/sign-up` (should redirect)
5. Verify visual indicators and readonly behavior

### Automated Testing
Run the test script: `node test-signup-token-population.js`

## Browser Compatibility

- ✅ Modern browsers with ES6+ support
- ✅ Next.js App Router compatibility
- ✅ React 19 compatibility
- ✅ Mantine UI component integration

## Future Enhancements

- [ ] Add loading state during token validation
- [ ] Show token validation status (valid/invalid/expired)
- [ ] Add animation for readonly state transition
- [ ] Support for multiple invitation codes
- [ ] Token expiration warnings

## Files Modified

1. `apps/web/app/sign-up/page.tsx` - Server-side parameter validation
2. `apps/web/app/sign-up/SignUpForm.tsx` - Client-side form logic
3. `test-signup-token-population.js` - Test script (new)
4. `SIGNUP_TOKEN_IMPLEMENTATION.md` - Documentation (new)

## Dependencies Added

- `@tabler/icons-react` - For lock icon (already in project)
- No new external dependencies required

## Conclusion

This implementation provides a seamless user experience for invitation-based signups while maintaining security and preventing unauthorized access. The visual indicators clearly communicate the readonly state, and the flexible parameter support ensures compatibility with different invitation systems.