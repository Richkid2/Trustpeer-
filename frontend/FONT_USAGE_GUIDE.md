# TrustPeer Font Usage Guide

## Font Stack Overview

**Primary Font**: New Kansas (Custom Brand Font)
**Secondary Font**: Inter (Google Fonts - For body text)

## New Kansas Font Weights Available

| Weight | Font File | CSS Class | Use Case |
|--------|-----------|-----------|----------|
| 100 | `New-Kansas-Thin.otf` | `font-thin` | Light decorative text |
| 300 | `New-Kansas-Light.otf` | `font-light` | Subtle headings |
| 400 | `New-Kansas-.otf` | `font-normal` | Regular text |
| 500 | `New-Kansas-Medium.otf` | `font-medium` | Small headings |
| 600 | `New-Kansas-Semi-Bold.otf` | `font-semibold` | Buttons, labels |
| 700 | `New-Kansas-Bold.otf` | `font-bold` | Section headings |
| 800 | `New-Kansas-Heavy.otf` | `font-extrabold` | Large headings |
| 900 | `New-Kansas-Black.otf` | `font-black` | Hero titles |

## Pre-defined Typography Classes

### Headings (New Kansas)
```css
.heading-hero    /* 3.5rem, font-black (900) - Main hero titles */
.heading-xl      /* 2.5rem, font-extrabold (800) - Page titles */
.heading-lg      /* 2rem, font-bold (700) - Section headings */
.heading-md      /* 1.5rem, font-semibold (600) - Subsection headings */
.heading-sm      /* 1.25rem, font-medium (500) - Card headings */
```

### Body Text (Inter for readability)
```css
.body-lg         /* 1.125rem, font-normal - Large body text */
.body-md         /* 1rem, font-normal - Regular body text */
.body-sm         /* 0.875rem, font-normal - Small body text */
```

### Buttons (New Kansas)
```css
.btn-text        /* 1rem, font-semibold (600) - Button labels */
```

## How to Use in Components

### Method 1: Using Pre-defined Classes
```jsx
// Hero title
<h1 className="heading-hero text-white">Welcome to TrustPeer</h1>

// Page title  
<h1 className="heading-xl text-white mb-4">Find Traders</h1>

// Section heading
<h2 className="heading-lg text-white mb-6">Connect Your Wallet</h2>

// Body text
<p className="body-md text-gray-400">Choose your preferred wallet to access TrustPeer</p>

// Button
<button className="btn-text bg-gradient-to-r from-[#f5762c] to-[#e53825]">
  Connect Wallet
</button>
```

### Method 2: Using Tailwind + Font Family Classes
```jsx
// Custom heading with New Kansas
<h1 className="font-kansas font-black text-4xl text-white">
  Custom Heading
</h1>

// Body text with Inter
<p className="font-inter text-base text-gray-400">
  This is readable body text using Inter font
</p>

// Button with New Kansas
<button className="font-kansas font-semibold text-lg text-white">
  Action Button
</button>
```

### Method 3: Direct Tailwind Font Weights
```jsx
// Use New Kansas as default with Tailwind weights
<h1 className="font-black text-5xl">Hero Title</h1>
<h2 className="font-bold text-3xl">Section Title</h2>
<h3 className="font-semibold text-xl">Card Title</h3>
<p className="font-inter font-normal text-base">Body text with Inter</p>
```

## Typography Hierarchy

### 1. Hero Section
- **Title**: `.heading-hero` or `font-kansas font-black text-5xl`
- **Subtitle**: `.body-lg` or `font-inter text-lg`

### 2. Page Headers
- **Main Title**: `.heading-xl` or `font-kansas font-extrabold text-4xl`
- **Description**: `.body-md` or `font-inter text-base`

### 3. Cards/Sections
- **Card Title**: `.heading-md` or `font-kansas font-semibold text-2xl`
- **Card Subtitle**: `.heading-sm` or `font-kansas font-medium text-xl`
- **Card Content**: `.body-md` or `font-inter text-base`

### 4. Buttons
- **Primary Buttons**: `.btn-text` or `font-kansas font-semibold text-base`
- **Secondary Buttons**: `font-kansas font-medium text-sm`

### 5. Forms
- **Labels**: `font-kansas font-semibold text-sm`
- **Input Text**: `font-inter font-normal text-base`
- **Helper Text**: `font-inter text-sm`

## Best Practices

### ✅ DO
- Use **New Kansas** for headings, buttons, and brand elements
- Use **Inter** for body text, descriptions, and long-form content
- Maintain consistent font weights across similar elements
- Use heavier weights (700-900) for important headings
- Use medium weights (500-600) for buttons and labels

### ❌ DON'T
- Don't use New Kansas for long paragraphs (readability)
- Don't mix too many font weights in one section
- Don't use thin weights (100-300) for small text
- Don't forget to specify fallback fonts

## Examples in Current Components

### Login Page
```jsx
// Header
<h2 className="heading-lg text-white mb-2">Welcome to TrustPeer</h2>
<p className="body-sm text-gray-400">Secure P2P trading</p>

// Buttons
<button className="btn-text bg-gradient-to-r from-[#f5762c] to-[#e53825]">
  Internet Identity
</button>
```

### Dashboard
```jsx
// Main heading
<h1 className="heading-xl text-white">Dashboard</h1>

// Card titles
<h3 className="heading-md text-white">Wallet Balance</h3>

// Stats
<span className="font-kansas font-black text-3xl text-[#f5762c]">$12,500</span>
```

### Trade Flow
```jsx
// Step titles
<h2 className="heading-lg text-white">Start New Trade</h2>

// Form labels
<label className="font-kansas font-semibold text-sm text-white">Amount</label>

// Input text uses Inter automatically via body font
<input className="font-inter text-base" />
```

## Performance Notes

- All fonts use `font-display: swap` for better loading performance
- Fonts are loaded locally from assets (no external requests)
- Inter is still loaded from Google Fonts as fallback for body text
- Browser will fallback gracefully if fonts fail to load

## Testing Font Loading

You can test if fonts are loaded properly by:
1. Opening DevTools → Network tab
2. Refreshing the page
3. Looking for .otf font file requests
4. Checking Elements tab to see computed font-family values

The font stack is: `'New Kansas', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
