# CSS Modules Parsing Error Fix

## Issue Identified
The SpamDetectionSection CSS module had invalid selectors that violated CSS Modules rules. The error was:

```
Parsing css source code failed
Selector is not pure (pure selectors must contain at least one local class or id)
(lightningcss, Selector([data-mantine-color-scheme="light"], specificity = 0x400))
```

## Root Cause
CSS Modules requires all selectors to contain at least one local class or id. The problematic selectors were:

```css
/* INVALID - No local class */
[data-mantine-color-scheme="light"] {
  background: radial-gradient(...);
}

@media (prefers-color-scheme: light) {
  background: radial-gradient(...);
}
```

## Fix Applied
1. **Removed invalid selectors**: Deleted the problematic global selectors
2. **Added proper local class selectors**: Used existing local classes with theme selectors
3. **Maintained functionality**: All light mode styling preserved with valid CSS Modules syntax

## Valid CSS Modules Pattern
```css
/* VALID - Contains local class */
[data-mantine-color-scheme="light"] .localClassName {
  /* styles */
}

@media (prefers-color-scheme: light) {
  .localClassName {
    /* styles */
  }
}
```

## Files Fixed
- `apps/web/app/(landing-page)/components/SpamDetectionSection/SpamDetectionSection.module.css` - ✅ Fixed CSS Modules violations

## Light Mode Styles Added
The following elements now have proper light mode contrast:

### Detection Interface
- **Background:** Light gray (#F4F4F4) with subtle shadows
- **Title:** High contrast (#1A1B1E)
- **Subtitle:** Improved contrast (#6B7280)

### Feature Items
- **Cards:** Light gray background with shadows
- **Titles:** High contrast (#1A1B1E)
- **Descriptions:** Improved contrast (#2C2E33)
- **Hover states:** Enhanced with darker backgrounds

## CSS Modules Compliance
✅ **All selectors now contain local classes**
✅ **Theme-aware styling maintained**
✅ **Responsive design preserved**
✅ **No functionality lost**

## Prevention
To avoid future CSS Modules issues:
1. Always include a local class in selectors (`.className`)
2. Use theme selectors with local classes: `[data-theme] .className`
3. Avoid global selectors in CSS Modules files
4. Test build after CSS changes

The SpamDetectionSection now has proper light mode contrast while maintaining CSS Modules compliance.