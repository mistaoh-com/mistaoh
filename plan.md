# Implementation Plan - Mista Oh Update

This plan outlines the steps to upgrade the Mista Oh application with MongoDB integration, User Authentication (with verification), Order Management, Admin Dashboard, and comprehensive Logging.

## Phase 1: Database & Core Models
**Goal:** Establish a robust data layer using Mongoose, enabling user verification and logging.

- [x] **Setup Database Connection**
    - Create `lib/db.ts` to handle MongoDB connection with caching.
    - Use `MONGODB_URI` from `.env`.
- [x] **Create Mongoose Models**
    - **User Model (`models/User.ts`)**:
        - Fields:
            - `name` (String, required)
            - `email` (String, required, unique)
            - `password` (String, required, hashed)
            - `phone` (String, required)
            - `isVerified` (Boolean, default: false)
            - `verificationToken` (String)
            - `verificationTokenExpiry` (Date)
            - `createdAt` (Date, default: Date.now)
            - *Note: No `role` field. Admin access is strictly via hardcoded credentials.*
    - **Order Model (`models/Order.ts`)**:
        - Fields: `user` (ref), `guestInfo` (opt), `items` (array), `totalAmount`, `status` (PENDING, PAID, PREPARING, READY, COMPLETED, CANCELLED), `stripeSessionId`, `paymentStatus`, `createdAt`.
    - **Log Model (`models/Log.ts`)**:
        - Fields:
            - `action` (String, e.g., 'USER_REGISTER', 'ORDER_PLACED', 'ADMIN_STATUS_CHANGE')
            - `userId` (ObjectId, ref: 'User', optional)
            - `metadata` (Object, flexible structure for details)
            - `ip` (String)
            - `userAgent` (String)
            - `timestamp` (Date, default: Date.now)
    - **MenuItem Model (`models/MenuItem.ts`)**:
        - Mirrors `lib/menu-data.ts` structure to enable dynamic menu management by Admin.
        - Fields: `title`, `korean`, `price`, `category`, `menuType` (lunch/dinner/drinks), `addOns`, etc.

## Phase 2: Authentication & Verification System
**Goal:** Secure the application with email verification and robust registration flow.

- [x] **Auth Utilities**
    - `lib/auth.ts`: Password hashing (`bcryptjs`), JWT handling (`jose`).
    - `lib/tokens.ts`: Generate secure random tokens for email verification.
- [x] **Email Service Integration**
    - Update `lib/email.ts` to support verification emails.
    - Template: "Verify your Mista Oh Account" with a link: `[BaseURL]/verify-email?token=xyz`.
    - Credentials: Use `MAIL_USER` and `EMAIL_PASS` from `.env`.
- [x] **API Routes**
    - `POST /api/auth/register`:
        - Validate Name, Email, Phone, Password, Confirm Password.
        - Create User (`isVerified: false`).
        - Send Verification Email.
    - `GET /api/auth/verify`:
        - Validate token.
        - Update user `isVerified: true`, clear token.
        - Redirect to login with success message.
    - `POST /api/auth/login`:
        - **Admin Check**: If email/pass matches Admin credentials -> Set Admin Session.
        - **User Check**: Find user -> Verify Password -> **Check `isVerified` is true** -> Set User Session.
    - `POST /api/auth/logout`: Clear session.

## Phase 3: User Interface & Experience
**Goal:** detailed registration and user dashboard.

- [x] **Registration Page (`app/(auth)/register/page.tsx`)**
    - **Form Fields**: Name, Email, Phone, Password, Confirm Password.
    - **Validation**: Zod schema to ensure passwords match and phone/email are valid.
    - **UI Features**:
        - "Eye" icon to toggle visibility for both password fields.
        - Success state: "Please check your email to verify your account."
- [x] **User Dashboard (Side Panel)**
    - Implement a Collapsible Side Panel (Sheet component).
    - **My Profile**: Display Name, Email, Phone.
    - **Order History**: List of past orders.
        - Real-time status updates (e.g., "Kitchen is preparing your order").
    - **Logging**: Log every view of the order history.

## Phase 4: Order Placement & Logging
**Goal:** Persist orders and log all critical transactions.

- [x] **Checkout API Update**
    - Upon Order Placement:
        - Create `Order` record.
        - Create `Log` entry: `ORDER_CREATED` { orderId, amount, items }.
    - **Guest vs Verified**: Ensure verify-email flow doesn't block guests if allowed (or enforce login). *Requirement implies mandatory registration for tracking, user journey needs to handle "Sign In / Register" at checkout.*
- [x] **Payment Verification**
    - On success: Update Order `status: PAID`.
    - Log: `PAYMENT_SUCCESS` { orderId, stripeId }.

## Phase 5: Admin Dashboard
**Goal:** Manage orders with full audit trail.

- [x] **Admin Authentication**
    - Use these from the .env file 
    ADMIN_USER=admin
    ADMIN_PASS=MistaOh@2026

- [x] **Order Management**
    - Admin views active orders.
    - Status Updates (Pending -> Preparing -> Ready -> Completed).
    - **Notifications**: Trigger email to user on status change.
    - **Logging**:
        - Log every status change: `ADMIN_UPDATE_ORDER` { orderId, oldStatus, newStatus, adminIp }.
- [x] **Logs Viewer (Optional Internal View)**
    - Simple page for Admin to view the `logs` collection to audit activities.

## Phase 6: Sync & Verification
**Goal:** Ensure reliability.

- [ ] **End-to-End Testing**
    - Register -> Receive Email -> Verify -> Login.
    - Place Order -> Admin Updates Status -> User receives Email.
    - Verify `logs` collection contains all expected events.
