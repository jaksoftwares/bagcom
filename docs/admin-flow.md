# BAGCOM Marketplace — Admin Flow Documentation

---

# 1. Overview

This document defines the **complete administrative workflow** for the Bagcom Marketplace system.

The admin system is responsible for:
- Platform control and governance
- Transaction monitoring
- Escrow oversight
- Dispute resolution
- User management
- Fraud prevention
- Financial reconciliation

The admin acts as the **trust authority layer** ensuring safe and fair marketplace operations.

---

# 2. Admin Role Structure

Bagcom supports multiple admin roles:

## 2.1 Super Admin
- Full system access
- Platform configuration control
- Financial oversight
- System-wide permissions

## 2.2 Support Admin
- Handles disputes
- Assists users
- Reviews flagged transactions

## 2.3 Compliance Admin
- Handles KYC verification
- Fraud investigations
- Seller approval/rejection

---

# 3. Admin Authentication Flow

## Step 1 — Secure Login
Admin logs in using:
- Email + password
- Optional MFA (recommended)

---

## Step 2 — Role Verification
System checks:
- Admin role permissions
- Access level restrictions

---

## Step 3 — Dashboard Access
Admin is redirected to:
- System dashboard
- Analytics overview
- Transaction monitoring panel

---

# 4. User Management Flow

## 4.1 Buyer Management
Admin can:
- View buyer accounts
- Suspend/ban users
- Review buyer disputes
- Monitor suspicious activity

---

## 4.2 Seller Management
Admin can:
- Approve seller accounts
- Reject unverified sellers
- Suspend fraudulent sellers
- Review seller performance

---

## 4.3 KYC Verification Flow

### Step 1 — Submission Review
Seller submits:
- ID documents
- Phone verification
- Optional selfie verification

---

### Step 2 — Admin Review
Admin verifies:
- Identity authenticity
- M-PESA ownership match
- Document validity

---

### Step 3 — Approval Decision
Status options:
- VERIFIED
- REJECTED
- PENDING REVIEW

---

# 5. Product Management Flow

## 5.1 Product Moderation
Admin can:
- Approve or reject listings
- Remove fake or illegal products
- Flag suspicious listings

---

## 5.2 Category Management
Admin can:
- Create categories
- Edit categories
- Remove outdated categories

---

## 5.3 Content Moderation Rules
System flags:
- Duplicate listings
- Scam-like descriptions
- Prohibited items
- Spam uploads

---

# 6. Transaction Monitoring Flow

Admin has full visibility into:

- All payments
- Escrow balances
- Order states
- Payment callbacks

---

## 6.1 Payment Tracking
Admin can view:
- STK Push requests
- Payment confirmations
- Failed transactions
- Reversal requests

---

## 6.2 Escrow Monitoring
Admin can see:
- Funds held in escrow
- Pending releases
- Completed payouts
- Frozen transactions

---

# 7. Order Lifecycle Oversight

Admin monitors full order pipeline:

| Stage | Meaning |
|------|--------|
| PENDING_PAYMENT | Awaiting payment |
| PAYMENT_CONFIRMED | Payment successful |
| ESCROW_ACTIVE | Funds held |
| PRODUCT_LOCKED | Product reserved |
| OUT_FOR_DELIVERY | Delivery ongoing |
| AWAITING_VERIFICATION | Code pending |
| COMPLETED | Successfully closed |
| DISPUTED | Under review |
| REFUNDED | Buyer refunded |

---

# 8. Dispute Resolution Flow

## 8.1 Dispute Initiation
Disputes can be raised by:
- Buyer
- Seller
- System anomaly detection

---

## 8.2 Dispute Review Process

### Step 1 — Case Collection
Admin collects:
- Order details
- Chat history
- Payment logs
- Delivery proof
- Verification attempts

---

### Step 2 — Investigation
Admin reviews:
- Evidence from both sides
- Transaction timeline
- Escrow status

---

### Step 3 — Decision Making
Possible outcomes:
- Release funds to seller
- Refund buyer
- Partial refund
- Escrow hold extension

---

### Step 4 — Enforcement
System executes admin decision:
- Triggers payout or refund
- Updates order status
- Notifies both parties

---

# 9. Escrow Management Flow

Admin can:
- View all escrowed funds
- Freeze suspicious transactions
- Release funds manually (override)
- Reconcile failed payouts

---

# 10. Financial Control Flow

## 10.1 Commission Configuration
Admin can:
- Set platform commission rate
- Apply category-specific commissions
- Update global pricing rules

---

## 10.2 Revenue Tracking
System displays:
- Total platform earnings
- Commission collected
- Payouts made
- Net balance

---

## 10.3 Reconciliation
Admin ensures:
- M-PESA transaction matching
- Escrow balance consistency
- Failed transaction recovery

---

# 11. Fraud Detection & Security Flow

Admin monitors:
- Suspicious buyer behavior
- Fake seller accounts
- Repeated failed payments
- Duplicate verification attempts
- Unusual payout patterns

---

## Actions Available:
- Flag account
- Suspend account
- Freeze escrow
- Trigger investigation
- Ban user permanently

---

# 12. Notification Management Flow

Admin controls system-wide alerts:

- System announcements
- Transaction alerts
- Dispute updates
- Security warnings

---

# 13. Analytics Dashboard Flow

Admin can view:

## Marketplace Metrics
- Total users
- Active sellers
- Active buyers
- Total listings

## Transaction Metrics
- Total orders
- Success rate
- Failure rate
- Dispute rate

## Financial Metrics
- Total revenue
- Commission earnings
- Payout volume

---

# 14. System Configuration Flow

Admin controls:

- Commission rates
- Escrow rules
- Verification code settings
- Order timeout durations
- Notification settings

---

# 15. Audit Logging System

Every admin action is logged:

- Admin ID
- Action performed
- Timestamp
- Affected entity
- Before/after state

This ensures:
- Accountability
- Traceability
- Security compliance

---

# 16. Support Ticket Flow

## Step 1 — Ticket Creation
Users submit support requests

---

## Step 2 — Admin Assignment
Tickets assigned to support admins

---

## Step 3 — Resolution
Admin:
- Investigates issue
- Communicates with users
- Resolves or escalates

---

## Step 4 — Closure
Ticket is marked:
- RESOLVED
- REJECTED
- ESCALATED

---

# 17. Admin Order Override Flow (Emergency Control)

Admin can:
- Force complete order
- Force refund
- Override verification code
- Freeze transaction
- Manually release escrow

Used only in:
- Fraud cases
- System failures
- Disputes requiring intervention

---

# 18. Summary

The Bagcom Admin System is the **central trust and control layer** of the platform.

It ensures:
- Secure marketplace operations
- Fraud prevention
- Fair dispute resolution
- Accurate financial tracking
- Safe escrow management
- Full system accountability

---

# 19. Final System Role

| Role | Responsibility |
|------|--------------|
| Buyer | Purchases products |
| Seller | Delivers products |
| Admin | Ensures trust, security, and system integrity |

---

# END OF ADMIN FLOW DOCUMENT