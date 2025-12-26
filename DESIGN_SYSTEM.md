# RIDE App - Modern Design System

## Overview
The RIDE app has been redesigned with a modern glassmorphism aesthetic and a fresh green color palette. This document outlines the new design system, color scheme, and implementation details.

## Design Philosophy
- **Glassmorphism**: Frosted glass effects with subtle transparency and blur
- **Modern UI**: Clean, minimalist interface with smooth shadows and rounded corners
- **Green Theme**: Fresh, eco-friendly color palette replacing the previous yellow theme
- **Accessibility**: High contrast ratios and clear visual hierarchy

## Color Palette

### Primary Colors
- **Primary Green**: `#10B981` - Main brand color, used for CTAs and highlights
- **Primary Dark**: `#059669` - Darker shade for hover states and emphasis
- **Primary Light**: `#34D399` - Lighter shade for backgrounds and accents

### Neutral Colors
- **Background**: `#F9FAFB` - Main app background
- **Background Dark**: `#111827` - Dark mode background (future use)
- **White**: `#FFFFFF` - Pure white for cards and surfaces
- **Text**: `#1F2937` - Primary text color
- **Text Light**: `#6B7280` - Secondary text, labels, and descriptions

### Semantic Colors
- **Success**: `#10B981` - Success states and confirmations
- **Error**: `#EF4444` - Error states and warnings
- **Warning**: `#F59E0B` - Warning states
- **Info**: `#3B82F6` - Informational messages

### Glassmorphism Colors
- **Glass Background**: `rgba(255, 255, 255, 0.25)` - Transparent white overlay
- **Glass Border**: `rgba(255, 255, 255, 0.4)` - Border for glass elements
- **Glass Shadow**: `rgba(0, 0, 0, 0.1)` - Subtle shadow for depth

### Gradient Colors
- **Gradient Start**: `#10B981`
- **Gradient Middle**: `#34D399`
- **Gradient End**: `#6EE7B7`

## Typography
- **Font Family**: Noto Sans (Bold, SemiBold, Medium, Regular, Light)
- **Hierarchy**: Clear distinction between headings (h2-h8) and body text
- **Line Height**: Optimized for readability (20-24px for body text)

## Component Styling

### Buttons
- **Border Radius**: 15px (increased from 10px)
- **Height**: 50px (increased from 45px)
- **Shadow**: Elevated with soft shadows
- **Active State**: 0.9 opacity on press

### Cards
- **Border Radius**: 20px (increased from 15px)
- **Shadow**: `shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20`
- **Background**: Pure white with subtle elevation
- **Border**: Optional 2px border with secondary color

### Input Fields
- **Border Radius**: 12px
- **Border Width**: 2px
- **Border Color**: Primary green
- **Background**: Secondary light (`#F0FDF4`)
- **Height**: 50px
- **Padding**: 15px horizontal

### Bottom Sheets
- **Border Radius**: 25px (top corners only)
- **Shadow**: Upward shadow for elevation
- **Background**: White with blur effect option
- **Padding**: 10-30px depending on content

### Icons & Images
- **Border Radius**: 15px for containers
- **Shadow**: Subtle shadows for depth
- **Size**: Consistent sizing (40x40 for standard icons)

## Shadows & Elevation

### Standard Shadow
```javascript
shadowColor: Colors.glass_shadow,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 12,
elevation: 8
```

### Light Shadow (for subtle elements)
```javascript
shadowColor: Colors.glass_shadow,
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 6,
elevation: 3
```

### Heavy Shadow (for floating elements)
```javascript
shadowColor: Colors.glass_shadow,
shadowOffset: { width: 0, height: 10 },
shadowOpacity: 0.15,
shadowRadius: 20,
elevation: 8
```

## New Features

### Onboarding Screens
- **Location**: `/app/onboarding.tsx`
- **Features**:
  - 3 slides introducing key app features
  - Animated pagination dots
  - Gradient background with glassmorphism footer
  - Skip and Next navigation
  - Stored in local storage to show only once

### Gradient Backgrounds
- Used in auth screens and onboarding
- Smooth transitions from primary to light green
- Creates depth and visual interest

### Glass Effects
- BlurView components for iOS-style frosted glass
- Used in onboarding footer and potential future overlays
- Maintains readability while adding visual sophistication

## Implementation Notes

### Updated Files
1. **Constants.tsx** - New color system and theme colors
2. **onboarding.tsx** - New onboarding flow
3. **role.tsx** - Updated with gradient and modern cards
4. **customer/auth.tsx** - Glass card design with gradient
5. **rider/auth.tsx** - Glass card design with gradient
6. **CustomButton.tsx** - Enhanced shadows and border radius
7. **PhoneInput.tsx** - Modern input styling with green theme
8. **All style files** - Updated with new colors and shadows

### Dependencies Added
- `expo-linear-gradient` - For gradient backgrounds

### Storage Keys
- `onboarding_completed` - Tracks if user has seen onboarding

## Migration from Yellow to Green

### Color Replacements
- `#EDD228` (old primary yellow) → `#10B981` (new primary green)
- `#CF551F` (old theme orange) → `#10B981` (new theme green)
- `#007AFF` (iOS blue) → `#10B981` (primary green)
- Hard-coded colors replaced with semantic color constants

### Visual Changes
- All yellow buttons and highlights now green
- Improved contrast ratios for better accessibility
- Consistent color usage across all components
- Modern shadows replace flat designs

## Best Practices

### Using Colors
```typescript
import { Colors } from '@/utils/Constants';

// Good
backgroundColor: Colors.primary

// Avoid
backgroundColor: '#10B981'
```

### Applying Shadows
```typescript
// Standard card shadow
shadowColor: Colors.glass_shadow,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 12,
elevation: 8
```

### Border Radius
- Small elements: 12px
- Buttons: 15px
- Cards: 20px
- Bottom sheets: 25px
- Circular: 100px

## Future Enhancements
- Dark mode support using backgroundDark colors
- Animated transitions between screens
- More glassmorphism effects in overlays
- Haptic feedback on interactions
- Micro-interactions and loading states

## Testing Checklist
- [ ] Onboarding shows on first launch
- [ ] Onboarding can be skipped
- [ ] All buttons use new green theme
- [ ] Shadows render correctly on both iOS and Android
- [ ] Text contrast meets accessibility standards
- [ ] Gradients display smoothly
- [ ] Glass effects work on iOS
- [ ] All screens maintain consistent styling

## Accessibility
- Color contrast ratios meet WCAG AA standards
- Text remains readable on all backgrounds
- Touch targets are minimum 44x44 points
- Focus indicators are visible
- Semantic colors convey meaning beyond color alone

