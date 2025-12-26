# Quick Design Reference

## Color Quick Reference

```typescript
import { Colors } from '@/utils/Constants';

// Primary Actions
Colors.primary          // #10B981 - Main green
Colors.primaryDark      // #059669 - Hover/pressed
Colors.primaryLight     // #34D399 - Light accent

// Backgrounds
Colors.background       // #F9FAFB - App background
Colors.white           // #FFFFFF - Cards/surfaces
Colors.secondary_light // #F0FDF4 - Input backgrounds

// Text
Colors.text            // #1F2937 - Primary text
Colors.textLight       // #6B7280 - Secondary text

// Borders
Colors.secondary       // #E0F2F1 - Borders
Colors.primary         // #10B981 - Active borders

// Status
Colors.success         // #10B981 - Success
Colors.error          // #EF4444 - Error
Colors.warning        // #F59E0B - Warning
```

## Shadow Patterns

### Standard Shadow (Cards, Buttons)
```typescript
shadowColor: Colors.glass_shadow,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 12,
elevation: 8
```

### Light Shadow (Subtle elements)
```typescript
shadowColor: Colors.glass_shadow,
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 6,
elevation: 3
```

### Upward Shadow (Bottom sheets)
```typescript
shadowColor: Colors.glass_shadow,
shadowOffset: { width: 0, height: -4 },
shadowOpacity: 0.15,
shadowRadius: 12,
elevation: 8
```

## Border Radius Guide

```typescript
// Small elements (inputs, small cards)
borderRadius: 12

// Buttons
borderRadius: 15

// Cards
borderRadius: 20

// Bottom sheets
borderTopLeftRadius: 25,
borderTopRightRadius: 25

// Circular (avatars, icon buttons)
borderRadius: 100
```

## Gradient Usage

```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/utils/Constants';

<LinearGradient
  colors={[Colors.gradient_start, Colors.gradient_middle, Colors.gradient_end]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={StyleSheet.absoluteFillObject}
/>
```

## Glass Effect

```typescript
import { BlurView } from 'expo-blur';

<BlurView intensity={40} tint="light" style={styles.glassContainer}>
  {/* Content */}
</BlurView>
```

## Button Styling

```typescript
<TouchableOpacity
  style={{
    backgroundColor: Colors.primary,
    borderRadius: 15,
    padding: 15,
    height: 50,
    shadowColor: Colors.glass_shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  }}
  activeOpacity={0.9}
>
  <Text>Button Text</Text>
</TouchableOpacity>
```

## Card Styling

```typescript
<View style={{
  backgroundColor: Colors.white,
  borderRadius: 20,
  padding: 20,
  shadowColor: Colors.glass_shadow,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.15,
  shadowRadius: 20,
  elevation: 8,
}}>
  {/* Card content */}
</View>
```

## Input Styling

```typescript
<TextInput
  style={{
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: Colors.secondary_light,
    color: Colors.text,
  }}
  placeholderTextColor={Colors.textLight}
/>
```

## Typography

```typescript
import CustomText from '@/components/shared/CustomText';

// Headings
<CustomText variant="h2" fontFamily="Bold">Large Title</CustomText>
<CustomText variant="h5" fontFamily="SemiBold">Section Title</CustomText>
<CustomText variant="h6" fontFamily="Medium">Subtitle</CustomText>

// Body
<CustomText variant="h7" fontFamily="Regular">Body text</CustomText>
<CustomText variant="h8" fontFamily="Light">Small text</CustomText>
```

## Spacing Scale

```typescript
// Padding
padding: 10   // Tight
padding: 15   // Standard
padding: 20   // Comfortable
padding: 30   // Spacious

// Margins
marginVertical: 10   // Small gap
marginVertical: 20   // Medium gap
marginVertical: 40   // Large gap

// Gap (in flexbox)
gap: 5    // Tight
gap: 10   // Standard
gap: 15   // Comfortable
```

## Common Patterns

### Screen Container
```typescript
<View style={{
  flex: 1,
  backgroundColor: Colors.background,
}}>
  {/* Content */}
</View>
```

### Bottom Sheet
```typescript
<View style={{
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: Colors.white,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  padding: 20,
  shadowColor: Colors.glass_shadow,
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
}}>
  {/* Content */}
</View>
```

### Icon Button
```typescript
<TouchableOpacity style={{
  width: 40,
  height: 40,
  borderRadius: 100,
  backgroundColor: Colors.white,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: Colors.glass_shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
}}>
  <Icon name="icon-name" size={20} color={Colors.primary} />
</TouchableOpacity>
```

### List Item
```typescript
<TouchableOpacity style={{
  flexDirection: 'row',
  alignItems: 'center',
  padding: 15,
  backgroundColor: Colors.white,
  borderRadius: 15,
  marginVertical: 5,
  shadowColor: Colors.glass_shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
}}>
  {/* Content */}
</TouchableOpacity>
```

## Onboarding Implementation

```typescript
// Check if onboarding is completed
const onboarding_completed = tokenStorage.getString("onboarding_completed");

if (!onboarding_completed) {
  router.replace("/onboarding");
}

// Mark as completed
tokenStorage.set('onboarding_completed', 'true');
```

## Testing Checklist

- [ ] Colors display correctly
- [ ] Shadows render on iOS
- [ ] Shadows render on Android
- [ ] Gradients display smoothly
- [ ] Touch targets are 44x44 minimum
- [ ] Text is readable on all backgrounds
- [ ] Animations are smooth
- [ ] Glass effects work on iOS
- [ ] Border radius is consistent
- [ ] Spacing is uniform

## Common Issues & Solutions

### Shadow not showing on Android
```typescript
// Add elevation
elevation: 8
```

### Shadow not showing on iOS
```typescript
// Ensure all shadow properties are set
shadowColor: Colors.glass_shadow,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 12,
```

### BlurView not working
```typescript
// Only works on iOS, provide fallback
Platform.OS === 'ios' ? (
  <BlurView intensity={40} tint="light">
    {/* Content */}
  </BlurView>
) : (
  <View style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
    {/* Content */}
  </View>
)
```

### Gradient not displaying
```typescript
// Ensure expo-linear-gradient is installed
npm install expo-linear-gradient --legacy-peer-deps
```

## Performance Tips

1. Avoid nesting multiple BlurViews
2. Use elevation instead of shadow when possible on Android
3. Cache gradient components
4. Optimize shadow usage (don't use on every element)
5. Use memo for complex styled components
6. Avoid inline styles when possible

## Accessibility

```typescript
// Ensure proper contrast
// Text on white: Colors.text (#1F2937)
// Text on primary: Colors.white (#FFFFFF)
// Secondary text: Colors.textLight (#6B7280)

// Touch targets
minHeight: 44,
minWidth: 44,

// Labels
accessibilityLabel="Button description"
accessibilityHint="What happens when pressed"
```

