# BAGCOM Marketplace — Buyer Flow Documentation

---

# 1. Overview

This document defines the **end-to-end buyer journey** in the Bagcom Marketplace system. The flow describes how a buyer discovers products, completes payment, receives delivery, and confirms completion using a verification-based escrow system.

The system is designed as a **fully functional eCommerce experience**, where:
- Buyers purchase products online
- Payment is completed upfront
- Products are locked only after payment success
- Sellers deliver physical goods
- Verification code is used to finalize the transaction

---

# 2. Buyer Account Setup Flow

## 2.1 Account Creation
- Buyer registers using:
  - Email or phone number
  - Password
- Verification (OTP) is sent to confirm identity

## 2.2 Profile Setup (Optional but recommended)
- Name
- Phone number
- Location
- Delivery preferences

---

# 3. Product Discovery Flow

## 3.1 Browsing Products
Buyer can:
- Browse all products
- Filter by category
- Sort by price, newest, or popularity
- View recommended items

## 3.2 Search Functionality
- Keyword search (product name, category, seller)
- Location-based search (nearby products)

## 3.3 Product View Page Includes:
- Product images
- Price
- Description
- Seller profile preview
- Location
- Stock availability
- Delivery expectations

---

# 4. Purchase Initiation Flow

## Step 1 — Select Product
Buyer clicks:
- “Buy Now”

System checks:
- Product availability
- Product not already locked

---

## Step 2 — Order Initialization
System creates:
- Pending order
- Temporary checkout session

Buyer sees:
- Product summary
- Total amount
- Terms & conditions

---

## Step 3 — Enter Payment Details
Buyer provides:
- M-PESA phone number

System prepares STK Push request.

---

# 5. Payment Flow (M-PESA Integration)

## Step 4 — STK Push Trigger
System sends payment request via Safaricom Daraja API:
- Amount
- Buyer phone number
- Merchant reference

---

## Step 5 — Buyer Approval
Buyer receives M-PESA prompt:
- Enters PIN
- Confirms payment

---

## Step 6 — Payment Confirmation
System receives callback:
- Validates transaction
- Confirms payment success

If successful:
- Order moves to PAYMENT_CONFIRMED
- Escrow is activated

---

# 6. Product Locking Flow (CRITICAL RULE)

Once payment is confirmed:

System automatically:
- Locks product (removes from active listings)
- Reserves stock for buyer
- Creates escrow record
- Generates order ID

Important:
> Product is ONLY locked after successful payment confirmation.

---

# 7. Escrow Activation Flow

After payment:
- Funds are held in platform escrow account
- Seller does NOT receive money yet
- Transaction is marked ACTIVE

System ensures:
- No duplicate payment processing
- No premature seller payout

---

# 8. Seller Information Release Flow

After escrow activation, buyer receives:

- Seller name
- Seller phone number
- Seller location/contact info
- Delivery instructions

This enables direct delivery coordination.

---

# 9. Order Tracking Flow

Buyer can track:
- Payment status
- Escrow status
- Delivery progress
- Seller activity

Statuses updated in real time:
- PAYMENT_SUCCESS
- ESCROW_ACTIVE
- PRODUCT_LOCKED
- OUT_FOR_DELIVERY

---

# 10. Delivery Flow

## Step 1 — Seller Delivers Product
- Physical handover occurs
- Delivery time recorded in system

## Step 2 — Buyer Receives Product
Buyer:
- Inspects product
- Confirms satisfaction

---

# 11. Verification Code Flow (CRITICAL STEP)

## Step 1 — Code Generation
System generates:
- Unique one-time verification code

Example:BGX-839201


## Step 2 — Buyer Shares Code
Buyer gives code to seller upon successful delivery.

---

## Step 3 — Seller Code Submission
Seller enters code into dashboard.

System validates:
- Code correctness
- Code ownership
- Code not expired
- Code not previously used

---

## Step 4 — Transaction Confirmation
If valid:
- Order marked COMPLETE
- Escrow released
- Seller paid via M-PESA B2C

---

# 12. Dispute Flow

If buyer is unhappy:

Buyer can:
- Raise dispute
- Submit evidence (images/messages)
- Request refund

System actions:
- Escrow is frozen
- Admin reviews case
- Decision is made:
  - Refund buyer
  - Pay seller
  - Partial settlement

---

# 13. Order Completion Flow

Once verification succeeds:
- Payment released to seller
- Commission deducted
- Order marked COMPLETED
- Buyer receives confirmation

---

# 14. Notification Flow

Buyer receives notifications at each stage:

## Events:
- Order placed
- Payment successful
- Product locked
- Seller details released
- Delivery in progress
- Verification code generated
- Order completed
- Dispute updates (if any)

---

# 15. Buyer Order Lifecycle Summary

| Stage | Description |
|------|-------------|
| Browsing | Buyer views products |
| Checkout | Buyer initiates purchase |
| Payment | M-PESA STK push |
| Confirmation | Payment verified |
| Locking | Product reserved |
| Escrow | Funds held securely |
| Delivery | Seller delivers item |
| Verification | Buyer confirms via code |
| Completion | Funds released |

---

# 16. Key Buyer Guarantees

- No payment is lost without delivery tracking
- Seller cannot access funds before delivery
- Product is secured after payment
- Full transaction transparency
- Dispute protection system available

---

# 17. Summary

The Bagcom buyer flow ensures a **secure, transparent, and fully automated eCommerce experience** where:

- Buyers pay online
- Products are locked after payment
- Sellers deliver physical goods
- Buyers confirm delivery via verification code
- Escrow ensures safe fund release

---

