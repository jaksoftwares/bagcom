# BAGCOM Marketplace — Seller Flow Documentation

---

# 1. Overview

This document defines the **end-to-end seller journey** in the Bagcom Marketplace system.

Bagcom is a fully functional eCommerce escrow platform where:
- Sellers list products online
- Buyers purchase and pay upfront
- Products are locked only after payment
- Sellers deliver physical goods
- Sellers receive payment only after buyer verification

The seller flow is designed to ensure:
- Fraud prevention
- Secure payouts
- Transparent order handling
- Verified delivery completion

---

# 2. Seller Account Setup Flow

## 2.1 Registration
Sellers register using:
- Email or phone number
- Password

System sends:
- OTP verification code

---

## 2.2 Seller Profile Setup

Sellers must complete:
- Full name / business name
- Phone number
- Location (pickup/delivery area)
- M-PESA number (for payouts)
- ID verification (KYC)

---

## 2.3 KYC Verification (Optional but Recommended)
Required documents:
- National ID
- Phone ownership verification
- Optional selfie verification

Status:
- PENDING
- VERIFIED
- REJECTED

Only VERIFIED sellers can receive payouts.

---

# 3. Product Listing Flow

## Step 1 — Create Product
Seller clicks:
- “Add Product”

---

## Step 2 — Product Details Input
Seller provides:
- Product name
- Description
- Category
- Price
- Condition (new/used)
- Quantity (if applicable)
- Location

---

## Step 3 — Upload Media
Seller uploads:
- Product images
- Optional video (future feature)

---

## Step 4 — Publish Listing
System publishes product:
- Visible to buyers
- Available for purchase
- Indexed in search system

---

# 4. Order Receiving Flow

## Step 1 — Buyer Purchase Notification
When buyer pays:
Seller receives:
- New order notification
- Product details
- Buyer order reference

---

## Step 2 — Order Status Update
System sets order status to:
- PAYMENT_SUCCESS
- ESCROW_ACTIVE
- PRODUCT_LOCKED

Important:
> Seller does NOT receive payment yet.

---

# 5. Product Locking Rule (CRITICAL)

Once buyer payment is confirmed:

System automatically:
- Locks product from marketplace
- Prevents duplicate sales
- Assigns order ownership to buyer

Seller can now ONLY:
- Prepare delivery
- View order details
- Communicate with buyer

---

# 6. Order Management Flow

Seller dashboard includes:

- Active orders
- Pending deliveries
- Completed orders
- Disputed orders

Each order shows:
- Buyer details
- Product details
- Delivery location
- Order status

---

# 7. Delivery Flow

## Step 1 — Prepare Product
Seller prepares item for delivery.

---

## Step 2 — Deliver Product
Seller physically delivers product via:
- Direct meeting
- Pickup location
- Courier (future integration)

---

## Step 3 — Delivery Confirmation
After delivering:
- Seller waits for buyer confirmation
- No payment is released yet

---

# 8. Verification Code Flow (CORE SYSTEM)

## Step 1 — Code Generation (System Controlled)
After delivery stage:
- System generates unique verification code
- Code is linked to order

Example:BGX-839201


---

## Step 2 — Buyer Shares Code
Buyer provides code to seller after receiving product.

---

## Step 3 — Seller Code Entry
Seller enters code in dashboard:
- “Verify Delivery”

---

## Step 4 — System Validation
System checks:
- Code correctness
- Order match
- Code validity
- Single-use status

---

## Step 5 — Success Confirmation
If valid:
- Order marked COMPLETED
- Escrow released
- Payment sent to seller

---

# 9. Payout Flow

## Step 1 — Escrow Release Trigger
After verification:
- Funds are released from escrow

---

## Step 2 — Commission Deduction
System calculates:
- Platform commission (e.g. 5–10%)

Example:
- Product Price: KES 10,000
- Commission: KES 1,000
- Seller receives: KES 9,000

---

## Step 3 — M-PESA B2C Transfer
System sends payout via:
- Safaricom B2C API

---

## Step 4 — Payout Confirmation
Seller receives:
- M-PESA confirmation SMS
- Dashboard update

---

# 10. Dispute Flow

If buyer raises issue:

System actions:
- Order status → DISPUTED
- Escrow frozen
- Seller notified

Seller can:
- Respond with evidence
- Communicate in chat
- Await admin decision

Possible outcomes:
- Payment released to seller
- Refund issued to buyer
- Partial settlement

---

# 11. Seller Communication Flow

Sellers can:
- Chat with buyers
- Share delivery updates
- Confirm delivery arrangements
- Resolve issues before escalation

All chats are:
- Order-specific
- Logged for audit purposes

---

# 12. Notification Flow

Sellers receive notifications for:

## Events:
- New order received
- Payment confirmed
- Product locked
- Delivery required
- Verification code submitted
- Payment released
- Dispute raised
- Refund or reversal

---

# 13. Seller Order Lifecycle

| Stage | Description |
|------|-------------|
| LISTED | Product published |
| ORDER_RECEIVED | Buyer purchased |
| PAYMENT_CONFIRMED | Payment verified |
| PRODUCT_LOCKED | Item reserved |
| OUT_FOR_DELIVERY | Seller delivering |
| AWAITING_VERIFICATION | Waiting for code |
| COMPLETED | Payment released |
| DISPUTED | Under review |

---

# 14. Seller Rules & Restrictions

- Cannot access buyer funds directly
- Cannot cancel order after payment without admin approval
- Must deliver product before payout
- Must wait for verification code confirmation

---

# 15. Security & Fraud Prevention

System enforces:
- No duplicate payouts
- No fake delivery confirmations
- No reused verification codes
- Full transaction logging
- Role-based access control

---

# 16. Seller Performance Tracking

Dashboard includes:
- Total sales
- Completed orders
- Pending orders
- Earnings history
- Dispute rate
- Rating score (future feature)

---

# 17. Summary

The Bagcom seller flow ensures a **secure, verified, and escrow-protected eCommerce system** where:

- Sellers list products freely
- Buyers pay before product locking
- Sellers deliver physical goods
- Buyers confirm via verification code
- Sellers receive automatic payout after confirmation

This guarantees:
- Zero payment fraud
- Safe seller earnings
- Structured delivery accountability
- Fully automated escrow settlement system

---