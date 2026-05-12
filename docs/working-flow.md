# BAGCOM Marketplace Platform — Final System Documentation

---

# 1. Project Overview

## Project Name
Bagcom Marketplace

## Type
Escrow-enabled eCommerce marketplace (second-hand + general goods)

## Core Concept
Bagcom is a secure online marketplace where users buy products directly. Once payment is completed, the system holds funds in escrow until the seller delivers the product and the buyer confirms receipt using a unique verification code.

---

# 2. System Purpose

Bagcom is designed to enable safe online commerce by solving trust issues in peer-to-peer and marketplace transactions.

It ensures:
- Buyers receive products before sellers get paid
- Sellers are protected from fake buyers
- Payments are securely held in escrow
- Delivery is verified before settlement

---

# 3. Core Marketplace Flow (IMPORTANT)

## Step 1 — Product Discovery
- Buyer browses products
- Searches by category, price, or location
- Views product details

## Step 2 — Purchase Initiation
- Buyer clicks “Buy Now”
- Enters M-PESA number
- Confirms order

## Step 3 — Payment Execution
- STK Push is triggered via M-PESA Daraja API
- Buyer enters PIN on phone
- Payment is processed

## Step 4 — Payment Confirmation
- System receives callback from M-PESA
- Validates transaction (amount, reference, phone)

## Step 5 — Product Locking (CRITICAL RULE)
- ONLY AFTER successful payment:
  - Product is locked (removed from active listing)
  - Stock is reserved for that buyer only
  - Order is created in escrow state

## Step 6 — Escrow Activation
- Funds are stored in platform escrow ledger
- Seller is NOT paid yet
- Transaction becomes active

## Step 7 — Seller Notification
Seller receives:
- Order confirmation
- Buyer delivery details
- Product to deliver
- Delivery timeline

## Step 8 — Product Delivery
- Seller physically delivers product
- Delivery is tracked in system

## Step 9 — Verification Code Generation
System generates:
- Unique one-time delivery code
- Linked to order
- Time-restricted validity (optional)

Example:BGX-839201


## Step 10 — Buyer Confirmation
- Buyer receives product
- Confirms satisfaction
- Shares verification code with seller

## Step 11 — Seller Verification
- Seller enters code into dashboard
- System validates:
  - Code correctness
  - Code ownership
  - Code validity
  - Not previously used

## Step 12 — Escrow Release
If valid:
- Funds released to seller via M-PESA B2C
- Commission deducted automatically
- Order marked COMPLETED

---

# 4. Escrow System Design

## Escrow Rules
- Funds are NEVER directly sent to seller on payment
- Funds remain locked until verification code confirmation
- Only system can release funds

## Escrow States
- PENDING_PAYMENT
- PAYMENT_CONFIRMED
- HELD_IN_ESCROW
- PRODUCT_LOCKED
- OUT_FOR_DELIVERY
- AWAITING_CONFIRMATION
- COMPLETED
- DISPUTED
- REFUNDED

---

# 5. Buyer Features

- Browse products
- Search & filter listings
- View seller profiles
- Purchase products
- Pay via M-PESA
- Track order status
- Receive verification codes
- Confirm delivery
- Raise disputes
- View order history

---

# 6. Seller Features

- Create seller account
- Upload products
- Manage inventory
- Receive orders
- Deliver products
- Enter verification codes
- Receive payouts
- View earnings dashboard
- Handle disputes

---

# 7. Admin Features

- Manage users
- Approve sellers (KYC)
- Monitor transactions
- Handle disputes
- Reverse payments
- Manage categories
- Control commissions
- View analytics

---

# 8. Product System

## Supported Categories
- Electronics
- Phones & accessories
- Furniture
- Clothing
- Home appliances
- Books
- Student essentials
- Gaming devices
- Vehicles
- Sports equipment

---

# 9. M-PESA Integration (Daraja API)

## Required APIs
- STK Push API
- B2C API
- OAuth API
- Callback URLs
- Transaction Status API
- Reversal API

---

# 10. Payment Architecture

## Payment Flow
1. Buyer initiates payment
2. STK Push request sent
3. Buyer approves payment
4. Callback confirms payment
5. System validates transaction
6. Escrow activated
7. Product locked
8. Order created

---

# 11. Delivery Verification System

## Verification Code Rules
- Unique per order
- Single-use only
- Time-bound validity
- Cryptographically generated

## Purpose
Prevents:
- Fake delivery claims
- Unauthorized payout release
- Fraudulent completion

---

# 12. Order Lifecycle

| Status | Meaning |
|--------|--------|
| PENDING_PAYMENT | Waiting for payment |
| PAYMENT_SUCCESS | Payment confirmed |
| ESCROW_ACTIVE | Funds held |
| PRODUCT_LOCKED | Item reserved |
| SHIPPED | Seller dispatched item |
| AWAITING_CODE | Waiting verification |
| COMPLETED | Transaction complete |
| DISPUTED | Issue raised |
| REFUNDED | Money returned |

---

# 13. Commission System

Example:
- Product Price: KES 10,000
- Commission: 10%
- Seller Receives: KES 9,000

Commission is deducted automatically during escrow release.

---

# 14. Communication System

## Features
- Buyer-seller chat
- Order-based messaging
- File sharing
- Delivery coordination
- Message status tracking

---

# 15. Notification System

## Channels
- Email
- SMS

## Events
- Payment successful
- Order created
- Product locked
- Delivery status
- Verification code issued
- Payment released
- Dispute updates

---

# 16. Security Model

- HTTPS enforced
- Callback signature validation
- Idempotent transaction handling
- Encrypted sensitive data
- Role-based access control
- Fraud detection logs

---

# 17. Dispute System

Triggers:
- Non-delivery
- Wrong product
- Fraud suspicion

Resolution:
- Admin review
- Refund buyer
- Release seller funds
- Partial settlement

Escrow is frozen during disputes.

---

# 18. Seller KYC Verification

Required:
- National ID
- Phone verification
- M-PESA ownership confirmation
- Optional selfie verification

Reduces:
- Fake sellers
- Fraud listings

---

# 19. Technology Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- ShadCN UI

## Backend
- Next.js API routes
- Serverless functions

## Database
- Supabase PostgreSQL

## Auth
- Supabase Auth

## Storage
- Cloudinary

## Payments
- Safaricom Daraja API

## Hosting
- Vercel

---

# 20. Serverless Architecture

Benefits:
- Auto-scaling
- Low maintenance
- Fast deployment
- Cost efficient

---

# 21. Callback Architecture

- /api/mpesa/stk/callback
- /api/mpesa/b2c/callback
- /api/orders/confirm
- /api/payments/reversal

All callbacks must be:
- Verified
- Logged
- Idempotent

---

# 22. Error Handling

- Failed payments
- Duplicate callbacks
- Expired verification codes
- Network failures
- Payment reversals
- Escrow mismatches

---

# 23. Scalability Design

Supports:
- High transaction volume
- Thousands of users
- Real-time messaging
- Large media uploads

Recommended:
- Redis caching
- Queue-based processing
- CDN for assets

---

# 24. Future Enhancements

- AI fraud detection
- Smart product recommendations
- Courier integration
- Delivery tracking system
- Seller ratings & reviews
- Product boosting system
- Auction system

---

# 25. Final Summary

Bagcom is a secure eCommerce marketplace where:

- Buyers pay first online
- Product is locked only after payment
- Seller delivers product physically
- Buyer confirms using a verification code
- Funds are released only after verification

This ensures:
- Zero payment fraud
- Full transaction accountability
- Safe peer-to-peer commerce
- Scalable marketplace infrastructure

---