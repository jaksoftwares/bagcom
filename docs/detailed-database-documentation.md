BAGCOM Marketplace Platform
Backend Database Infrastructure Documentation
1. Introduction
1.1 Purpose of This Document

This document defines the complete backend database infrastructure for the Bagcom escrow-enabled second-hand marketplace platform.

The objective of this database architecture is to provide:

Scalability
Security
Transaction integrity
Escrow tracking
Payment reconciliation
Real-time communication support
Auditability
Fraud prevention capabilities
High-performance marketplace operations

The database is designed around PostgreSQL using Supabase as the managed database provider.

2. Database Architecture Overview
2.1 Database Engine

Recommended database engine:

PostgreSQL 16+

Managed provider:

Supabase
3. Core Architectural Principles

The database architecture follows these principles:

3.1 Normalization

The database should follow:

Third Normal Form (3NF)

This minimizes:

Data duplication
Inconsistent records
Redundant updates
3.2 Transaction Integrity

Critical operations must use:

ACID-compliant database transactions

Especially for:

Payments
Escrow handling
Seller payouts
Delivery confirmations
3.3 Auditability

Every sensitive action should be traceable:

Payment callbacks
Order status changes
Payout attempts
Admin actions
Disputes
Reversals
3.4 Scalability

The system is designed for:

Millions of products
High concurrent traffic
Real-time messaging
Large transaction volumes
4. Database Schema Overview
Core Modules
Module	Purpose
Authentication	User identity
Users	Buyer and seller profiles
Marketplace	Product listings
Orders	Buyer purchases
Payments	M-PESA tracking
Escrow	Holding buyer funds
Payouts	Seller settlements
Messaging	Real-time chat
Notifications	Email/SMS
Disputes	Conflict management
Reviews	Trust system
Analytics	Platform reporting
Audit Logs	System traceability
5. ENUM TYPES

Using ENUMs improves consistency and performance.

5.1 User Roles
ENUM user_role
- BUYER
- SELLER
- ADMIN
- SUPER_ADMIN
5.2 Order Status
ENUM order_status
- PENDING_PAYMENT
- PAYMENT_SUCCESS
- HELD_IN_ESCROW/for confirmation
- PROCESSING_DELIVERY
- DELIVERED
- PAYOUT_PENDING
- PAYOUT_SENT
- COMPLETED
- FAILED
- CANCELLED
- REVERSED
- DISPUTED
5.3 Product Condition
ENUM product_condition
- NEW
- LIKE_NEW
- GOOD
- FAIR
- POOR
5.4 Payment Status
ENUM payment_status
- PENDING
- SUCCESS
- FAILED
- REVERSED
- TIMEOUT
5.5 Payout Status
ENUM payout_status
- PENDING
- PROCESSING
- SUCCESS
- FAILED
- REVERSED
5.6 Verification Status
ENUM verification_status
- UNVERIFIED
- PENDING
- VERIFIED
- REJECTED
6. USERS MODULE
6.1 users Table
Purpose

Stores all platform users.

Fields
Field	Type	Description
id	UUID PK	Primary key
email	VARCHAR UNIQUE	User email
phone_number	VARCHAR UNIQUE	M-PESA linked number
password_hash	TEXT	Encrypted password
first_name	VARCHAR	User first name
last_name	VARCHAR	User last name
profile_photo_url	TEXT	Profile image
role	user_role	System role
is_active	BOOLEAN	Active status
is_email_verified	BOOLEAN	Email verification
is_phone_verified	BOOLEAN	Phone verification
created_at	TIMESTAMP	Record creation
updated_at	TIMESTAMP	Last update
deleted_at	TIMESTAMP NULL	Soft deletion
Relationships
users
 ├── seller_profiles
 ├── buyer_profiles
 ├── orders
 ├── products
 ├── chats
 ├── notifications
 ├── reviews
 └── disputes
6.2 seller_profiles Table
Purpose

Stores seller-specific information.

Fields
Field	Type
id	UUID PK
user_id	UUID FK
shop_name	VARCHAR
bio	TEXT
national_id_number	VARCHAR
mpesa_number	VARCHAR
verification_status	verification_status
average_rating	DECIMAL
total_sales	INTEGER
total_products	INTEGER
total_reviews	INTEGER
location_id	UUID FK
created_at	TIMESTAMP
6.3 buyer_profiles Table
Purpose

Stores buyer-specific preferences.

Fields
Field	Type
id	UUID PK
user_id	UUID FK
preferred_radius_km	INTEGER
favorite_categories	JSONB
total_orders	INTEGER
total_spent	DECIMAL
created_at	TIMESTAMP
7. LOCATION MODULE
7.1 locations Table
Purpose

Stores geolocation data.

Fields
Field	Type
id	UUID PK
county	VARCHAR
city	VARCHAR
institution_name	VARCHAR
latitude	DECIMAL
longitude	DECIMAL
formatted_address	TEXT
created_at	TIMESTAMP
Purpose of Geolocation
 - location /auto
 - auto update user location on background -or autodetect location  - to ease the burden of the user having to enter the location manually.-   the sellers will have to enter their location manually/we be able to have a transparent location of where they are/ where they will be meeting up from to sell the products etc ...

Used for:

Nearby product visibility
Distance filtering
Campus-specific marketplaces
Delivery radius calculations
8. PRODUCT MODULE
8.1 categories Table
Fields
Field	Type
id	UUID PK
parent_id	UUID FK NULL
name	VARCHAR
slug	VARCHAR
icon	TEXT
created_at	TIMESTAMP
8.2 products Table
Purpose

Stores marketplace product listings.

Fields
Field	Type
id	UUID PK
seller_id	UUID FK
category_id	UUID FK
title	VARCHAR
slug	VARCHAR UNIQUE
description	TEXT
price	DECIMAL
negotiable	BOOLEAN
condition	product_condition
quantity_available	INTEGER
is_available	BOOLEAN
location_id	UUID FK
view_count	INTEGER
favorite_count	INTEGER
status	VARCHAR
created_at	TIMESTAMP
updated_at	TIMESTAMP
deleted_at	TIMESTAMP NULL
Relationships
products
 ├── product_images
 ├── product_views
 ├── product_favorites
 ├── orders
 └── reviews
 - products will have
8.3 product_images Table
Fields
Field	Type
id	UUID PK
product_id	UUID FK
image_url	TEXT
display_order	INTEGER
created_at	TIMESTAMP
-these images will be stored in cloudinary, only the url will be stored in supabase - so there should be proper engineering for the media and images and their security and management...

8.4 product_favorites Table
Purpose

Wishlist system.

Fields
Field	Type
id	UUID PK
user_id	UUID FK
product_id	UUID FK
created_at	TIMESTAMP
9. ORDER MANAGEMENT MODULE
9.1 orders Table
Purpose

Central order lifecycle tracking.

Fields
Field	Type
id	UUID PK
buyer_id	UUID FK
seller_id	UUID FK
product_id	UUID FK
order_number	VARCHAR UNIQUE
quantity	INTEGER
subtotal_amount	DECIMAL
commission_amount	DECIMAL
total_amount	DECIMAL
escrow_amount	DECIMAL
seller_receivable	DECIMAL
status	order_status
delivery_code	VARCHAR
delivery_code_expires_at	TIMESTAMP
is_delivery_confirmed	BOOLEAN
confirmed_at	TIMESTAMP
completed_at	TIMESTAMP
cancelled_at	TIMESTAMP
created_at	TIMESTAMP
updated_at	TIMESTAMP
Critical Business Logic

The order table controls:

Escrow lifecycle
Delivery confirmation
Seller settlements
Transaction completion
10. PAYMENT MODULE
10.1 payment_transactions Table
Purpose

Tracks all M-PESA payments.

Fields
Field	Type
id	UUID PK
order_id	UUID FK
merchant_request_id	VARCHAR
checkout_request_id	VARCHAR
mpesa_receipt_number	VARCHAR
payer_phone	VARCHAR
amount	DECIMAL
status	payment_status
callback_payload	JSONB
callback_received_at	TIMESTAMP
raw_callback	JSONB
result_code	VARCHAR
result_description	TEXT
transaction_date	TIMESTAMP
created_at	TIMESTAMP
Important Notes

The raw callback payload must ALWAYS be stored.

This enables:

Auditing
Reconciliation
Fraud investigations
Payment tracing
10.2 escrow_transactions Table
Purpose

Tracks escrow holding logic.

Fields
Field	Type
id	UUID PK
order_id	UUID FK
held_amount	DECIMAL
escrow_status	VARCHAR
held_at	TIMESTAMP
released_at	TIMESTAMP
reversed_at	TIMESTAMP
notes	TEXT
11. PAYOUT MODULE
11.1 payouts Table
Purpose

Tracks seller settlements.

Fields
Field	Type
id	UUID PK
order_id	UUID FK
seller_id	UUID FK
amount	DECIMAL
commission_deducted	DECIMAL
payout_phone_number	VARCHAR
conversation_id	VARCHAR
originator_conversation_id	VARCHAR
response_code	VARCHAR
response_description	TEXT
status	payout_status
callback_payload	JSONB
raw_callback	JSONB
attempted_at	TIMESTAMP
completed_at	TIMESTAMP

12. MESSAGING MODULE
12.1 conversations Table
Fields
Field	Type
id	UUID PK
buyer_id	UUID FK
seller_id	UUID FK
product_id	UUID FK
order_id	UUID FK NULL
created_at	TIMESTAMP
12.2 messages Table
Fields
Field	Type
id	UUID PK
conversation_id	UUID FK
sender_id	UUID FK
message	TEXT
attachment_url	TEXT
is_read	BOOLEAN
sent_at	TIMESTAMP

13. NOTIFICATIONS MODULE
13.1 notifications Table
Fields
Field	Type
id	UUID PK
user_id	UUID FK
type	VARCHAR
title	VARCHAR
body	TEXT
channel	VARCHAR
is_sent	BOOLEAN
sent_at	TIMESTAMP
created_at	TIMESTAMP
14. DISPUTE MANAGEMENT MODULE
14.1 disputes Table
Purpose

Handles transaction conflicts.

Fields
Field	Type
id	UUID PK
order_id	UUID FK
opened_by	UUID FK
reason	TEXT
evidence_urls	JSONB
resolution_notes	TEXT
status	VARCHAR
resolved_by	UUID FK
resolved_at	TIMESTAMP
created_at	TIMESTAMP

15. REVIEW SYSTEM
15.1 reviews Table
Fields
Field	Type
id	UUID PK
reviewer_id	UUID FK
seller_id	UUID FK
order_id	UUID FK
rating	INTEGER
comment	TEXT
created_at	TIMESTAMP

16. AUDIT LOGGING SYSTEM
16.1 audit_logs Table
Purpose

Tracks all sensitive system actions.

Fields
Field	Type
id	UUID PK
actor_id	UUID FK
entity_type	VARCHAR
entity_id	UUID
action	VARCHAR
previous_data	JSONB
new_data	JSONB
ip_address	VARCHAR
user_agent	TEXT
created_at	TIMESTAMP

17. ADMIN MODULE
17.1 admin_actions Table
Fields
Field	Type
id	UUID PK
admin_id	UUID FK
action	VARCHAR
target_entity	VARCHAR
target_id	UUID
notes	TEXT
created_at	TIMESTAMP
18. SECURITY INFRASTRUCTURE
18.1 Security Requirements

The database must support:

Row-level security
Role-based access control
Encrypted credentials
Secure API keys
IP logging
Rate limiting support
Soft deletion
Audit trails

19. SUPABASE ROW LEVEL SECURITY (RLS)
Example Policies
Buyers

Can only:

View own orders
Access own messages
Manage own profile
Sellers

Can only:

Access own products
View own payouts
Access own conversations
Admins

Can:

Access all records
Resolve disputes
Audit transactions
20. INDEXING STRATEGY
Important Database Indexes

Indexes should exist on:

Products
(title)
(category_id)
(location_id)
(price)
(created_at)
Orders
(order_number)
(status)
(buyer_id)
(seller_id)
Payments
(mpesa_receipt_number)
(checkout_request_id)
(status)

21. DATABASE PERFORMANCE STRATEGY
Recommendations
Use:
Connection pooling
Read replicas
Query optimization
Materialized views
Caching
Avoid:
N+1 queries
Large joins without indexes
Full table scans
22. BACKUP STRATEGY
Required Backup Plan
Daily automated backups
Point-in-time recovery
Multi-region redundancy
Disaster recovery plan
23. FUTURE DATABASE EXPANSION
Future Tables

Potential future modules:

Courier integrations
AI fraud detection
Recommendation engine
Subscription system
Ads/promotions
Auction system
Wallet balances


24. CONCLUSION

The Bagcom backend database infrastructure is designed as a scalable, secure, transaction-safe architecture capable of supporting a full escrow-enabled marketplace ecosystem.

The architecture supports:

M-PESA escrow payments
Automated seller payouts
Real-time messaging
Geolocation-based marketplace discovery
Auditability and compliance
Dispute resolution
High scalability

Using PostgreSQL with Supabase provides:

Strong relational integrity
Realtime capabilities
Built-in authentication
Serverless scalability
Simplified DevOps management