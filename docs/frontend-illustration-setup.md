BAGCOM MARKETPLACE PLATFORM
COMPLETE USER-SIDE & FRONTEND ARCHITECTURE (FULL SYSTEM)
1. INTRODUCTION

This document defines the complete frontend system architecture for Bagcom, including:

Core marketplace pages
Buyer & seller workflows
Admin-facing frontend modules
Legal & compliance pages
Support & trust systems
Informational architecture
Authentication flows
Communication systems
System-level utility pages

This is the complete production-grade frontend map of the platform.

2. FULL ROUTE ARCHITECTURE (GLOBAL MAP)
/
/marketplace
/product/[slug]
/categories
/search
/checkout/[orderId]
/orders
/orders/[id]

/auth/login
/auth/register
/auth/verify
/auth/forgot-password

/seller/dashboard
/seller/products
/seller/orders
/seller/upload
/seller/payouts

/profile
/settings
/notifications
/messages

/disputes

/help
/faqs
/contact
/support

/legal/terms
/legal/privacy
/legal/cookies
/legal/refund-policy
/legal/escrow-policy

/about
/careers
/blog

/admin/dashboard
/admin/users
/admin/orders
/admin/disputes
/admin/analytics
3. CORE MARKETPLACE MODULE
3.1 Home Page — /
Purpose:

Entry point for all users.

Features:
Featured products
Nearby products (location-aware)
Trending listings
Category shortcuts
Search bar
Login / signup CTA
Trust banners (escrow protection highlight)
3.2 Marketplace — /marketplace
Purpose:

Full product discovery engine.

Features:
Product grid
Filters:
Price range
Category
Condition
Distance
Seller rating
Sorting:
Newest
Cheapest
Nearest
Infinite scroll
3.3 Product Details — /product/[slug]
Features:
Image gallery
Product description
Seller profile preview
Location map
Chat button
Buy now (M-PESA)
Similar products
Report listing
3.4 Categories — /categories
Features:
Category grid
Subcategories
Popular categories
Search within category
3.5 Search Page — /search
Features:
Keyword search
AI-assisted suggestions (future)
Filters
Recent searches
Trending searches
4. AUTHENTICATION MODULE
4.1 Login — /auth/login
Features:
Email login
Phone login
Password login
Forgot password
4.2 Register — /auth/register
Features:
Role selection (Buyer / Seller)
Email
Phone number (M-PESA linked)
Password
OTP verification
4.3 Verification — /auth/verify
Features:
OTP input
Email verification
Phone verification
4.4 Password Reset — /auth/forgot-password
5. CHECKOUT & PAYMENT MODULE
5.1 Checkout — /checkout/[orderId]
Features:
Order summary
M-PESA input
STK Push trigger
Payment status tracker
Escrow confirmation screen
6. ORDER MANAGEMENT MODULE
6.1 Orders — /orders
Features:
Order history
Status tracking
Filters (completed, pending, disputed)
6.2 Order Details — /orders/[id]
Features:
Full lifecycle tracking
Delivery code display
Chat access
Dispute button
Payment breakdown
7. SELLER MODULE
7.1 Seller Dashboard — /seller/dashboard
Features:
Revenue overview
Orders summary
Active listings
Pending payouts
7.2 Products — /seller/products
Features:
Manage listings
Edit / delete products
Stock status
7.3 Upload Product — /seller/upload
Features:
Product creation form
Image upload
Category selection
Pricing setup
Location tagging
7.4 Seller Orders — /seller/orders
Features:
Incoming orders
Delivery tracking
Confirmation code input
Fulfillment status
7.5 Payouts — /seller/payouts
Features:
Earnings history
Commission breakdown
Payout status
8. PROFILE & SETTINGS MODULE
8.1 Profile — /profile
Features:
User details
Profile image
Order history
Saved items
8.2 Settings — /settings
Features:
Account settings
Security settings
Notification settings
Location preferences
9. COMMUNICATION MODULE
9.1 Messages — /messages
Features:
Buyer-seller chat
Order-linked conversations
Real-time messaging
Media sharing
10. NOTIFICATIONS MODULE
10.1 Notifications — /notifications
Features:
Payment updates
Order updates
Delivery confirmations
System alerts
11. DISPUTE SYSTEM
11.1 Disputes — /disputes
Features:
Raise dispute
Upload evidence
Track resolution
Admin communication
12. SUPPORT & HELP SYSTEM
12.1 Help Center — /help
Features:
Support categories
Guides
Self-service help articles
12.2 FAQ — /faqs
Features:
General marketplace FAQs
Payment FAQs
Seller FAQs
Escrow FAQs
12.3 Contact Page — /contact
Features:
Support form
Email contact
Phone contact
Live chat (optional)
12.4 Support Ticket System — /support
Features:
Create ticket
Track ticket status
Response history
Attachments
13. LEGAL & COMPLIANCE MODULE
13.1 Terms & Conditions — /legal/terms
Covers:
User responsibilities
Platform rules
Payment rules
Escrow terms
Liability clauses
13.2 Privacy Policy — /legal/privacy
Covers:
Data collection
Data usage
User rights
Data protection policies
13.3 Cookies Policy — /legal/cookies
Covers:
Cookie usage
Tracking policies
User consent
13.4 Refund Policy — /legal/refund-policy
Covers:
Refund eligibility
Dispute conditions
Escrow rules
Return conditions
13.5 Escrow Policy — /legal/escrow-policy
Covers:
How escrow works
Fund holding rules
Release conditions
Security guarantees
14. ABOUT & INFORMATION MODULE
14.1 About Page — /about
Features:
Company mission
Vision
Platform explanation
Trust messaging
14.2 Blog — /blog
Features:
Marketplace updates
Safety tips
Seller guides
Community stories
14.3 Careers — /careers
Features:
Job listings
Company culture
Hiring information
15. ADMIN FRONTEND MODULE
15.1 Admin Dashboard — /admin/dashboard
Features:
Platform analytics
Revenue tracking
System health
15.2 User Management — /admin/users
Ban/unban users
Verify sellers
Monitor activity
15.3 Orders — /admin/orders
View all transactions
Track escrow
Investigate issues
15.4 Disputes — /admin/disputes
Resolve conflicts
Approve refunds
Investigate fraud
15.5 Analytics — /admin/analytics
Revenue trends
User growth
Conversion rates
16. GLOBAL SYSTEM PAGES
16.1 404 Page
Features:
Friendly error message
Navigation back to marketplace
Search bar
16.2 500 Error Page
Features:
System failure message
Retry button
Support link
16.3 Maintenance Page
Features:
Downtime message
Estimated recovery time
17. TRUST & SAFETY MODULES

These are embedded UI systems:

Verified seller badges
Escrow protection banners
Fraud warnings
Secure payment indicators
Buyer protection notices
18. LOCATION SYSTEM INTEGRATION

Used across:

Home
Marketplace
Search
Product pages

Features:

GPS permission request
Manual location input
Campus-based filtering
Radius-based discovery
19. UI SYSTEM CONSISTENCY RULES
Design Principles:
Minimal UI
High readability
Mobile-first design
Trust-centered layout
Fast interactions
Component Standards:
Buttons: rounded, clean
Cards: soft shadows
Inputs: simple borders
Modals: minimal overlays
20. NAVIGATION STRUCTURE
Primary Navigation:
Home
Marketplace
Categories
Sell
Messages
Orders
Profile
Secondary Navigation:
Help
FAQs
Contact
Legal
21. SYSTEM SUMMARY

This frontend architecture now includes:

✔ Core marketplace system
✔ Buyer & seller workflows
✔ Payment & escrow flows
✔ Chat system
✔ Admin system
✔ Notifications
✔ Location-based discovery
✔ Full authentication system
✔ Legal & compliance pages
✔ Support & help center
✔ Informational pages (About, Blog, Careers)
✔ Error handling pages
✔ Trust & safety systems