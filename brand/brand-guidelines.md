# Bagcom Brand Identity & Logo System

Welcome to the official Bagcom brand system. This document outlines the core visual identity, typography, color palette, and logo usage rules for the Bagcom marketplace.

## 1. The Logo Concept
The Bagcom logo is engineered as a clean, modern, and mathematically scalable vector mark. 
It combines three core visual elements:
1. **The "B" Monogram**: A modern, continuous geometric structure.
2. **The Shopping Bag**: Formed by the outer stroke loop, representing commerce and second-hand exchange.
3. **Connection Nodes**: The two internal circles represent the buyer and seller, connected by a secure path (escrow).

## 2. Color Palette
Our colors are specifically chosen to inspire trust while feeling youthful and technologically advanced.

| Color Name | HEX Code | RGB | Purpose |
|------------|----------|-----|---------|
| **Primary Green** | `#16A34A` | `22, 163, 74` | Trust, Escrow Security, Growth |
| **Deep Slate** | `#0F172A` | `15, 23, 42` | Professionalism, Brand Text, App Backgrounds |
| **Accent Blue** | `#3B82F6` | `59, 130, 246` | Digital Interaction, Links, Secondary Nodes |
| **Light Gray** | `#F8FAFC` | `248, 250, 252` | App Backgrounds, Neutral Spaces |
| **White** | `#FFFFFF` | `255, 255, 255` | Text on Dark Backgrounds |

## 3. Typography System
Bagcom uses highly legible, modern sans-serif fonts to maintain a digital-first, premium aesthetic.

- **Primary Font: Inter** (Weights: Regular 400, Semi-Bold 600, Extra-Bold 800)
  - Used for the main Bagcom wordmark (Weight: 800, tracking: -0.04em).
  - Used for all UI elements, application text, and data display.
- **Secondary Font: Poppins**
  - Used strictly for large marketing headers and promotional banners.

## 4. Provided Assets & Files
Your `brand/assets/logo/` folder contains pixel-perfect, scalable SVG files for all layout variations:

1. `primary-logo.svg` - Horizontal layout for web headers.
2. `secondary-logo.svg` - Stacked layout for marketing prints.
3. `icon-only.svg` - The standalone mark.
4. `monochrome-logo.svg` - 1-color black/slate version for restricted printing.
5. `logo-dark-bg.svg` - Engineered with inverted text/stem for `#0F172A` backgrounds.
6. `logo-light-bg.svg` - Built with the `#F8FAFC` background.
7. `mobile-app-icon.svg` - Scaled to 1024x1024 for App Store / Google Play packaging.
8. `favicon.svg` - Minimized and optimized for browser tabs.

### Exporting to PNG and PDF
To generate exact, high-resolution `.png` and `.pdf` files without any external design software:
1. Open the file `brand/export-dashboard.html` in your web browser.
2. You will see a visual preview of all 10 logo variations.
3. Click **"PNG"** or **"PDF"** to instantly download the required formats directly to your computer.

## 5. Logo Usage Rules
To maintain brand integrity and a premium aesthetic (similar to Stripe or Airbnb), follow these strict rules:
- **Minimum Clear Space:** The minimum padding around the logo should equal the height of the "B". Do not crowd the logo with other UI elements.
- **Minimum Size:** The Full Logo should never be rendered smaller than 120px wide. The Icon-Only logo should never be smaller than 32px wide.
- **Prohibitions:** 
  - DO NOT stretch or distort the aspect ratio.
  - DO NOT change the specific HEX colors of the logo paths.
  - DO NOT apply drop shadows directly to the SVG paths.
  - DO NOT use the dark-bg logo on a white background or vice versa.

## 6. UI & Design Philosophy
The Bagcom interface should always prioritize:
- **Cleanliness:** Use ample whitespace (Light Gray `#F8FAFC`).
- **Soft Geometry:** Use 12px border radius for buttons and 20px for cards to match the soft, rounded aesthetic of the logo nodes.
- **Subtle Depth:** Shadows should be soft and spread out (`box-shadow: 0 4px 12px rgba(0,0,0,0.05)`).
- **Security Visibility:** Ensure Escrow trust badges are clearly visible utilizing Primary Green `#16A34A`.
