# User Journeys 
SS
## 1. Customer Journey

### Phase 1: Discovery & Selection
1.  **Arrival**: Customer visits the website (`/`).
2.  **Browsing**: Customer navigates to the "Menu" page.
    *   They view categories (e.g., Appetizers, Entrees, Drinks).
    *   They see item details (image, description, price).
3.  **Selection**: Customer clicks "Add to Cart" on desired items.
    *   A cart notification or sidebar updates with the total items and price.

### Phase 2: Checkout & Authentication
4.  **Initiate Checkout**: Customer clicks the "Checkout" button in the cart.
5.  **Authentication Gate**:
    *   **Scenario A (New User)**: The system prompts them to "Sign In" or "Continue as Guest" (if we allow that, but request implies account creation is preferred for tracking).
        *   User selects "Sign in with Google" OR enters their Phone Number and Full Name to create a quick account.
    *   **Scenario B (Returning User)**: User is already logged in or easily re-authenticates via Google/Phone.
6.  **Order Details**:
    *   User reviews the order summary.
    *   User confirms "Pickup" details (time, location is fixed usually).
    *   User enters Payment Information (Stripe).

### Phase 3: Post-Order
7.  **Order Placement**: User clicks "Place Order".
8.  **Confirmation**:
    *   User discovers a "Order Success" page with an **Order ID**.
    *   User receives an immediate "Order Received" email.
9.  **Fulfillment Update**:
    *   Later, when the food is ready/picked up, the user receives a second email: "Your order is Complete".
    *   (Optional) User can log in to their "Profile" to see past orders.

---

## 2. Restaurant Owner (Admin) Journey

### Phase 1: Access & Monitoring
1.  **Admin Login**: Owner visits a hidden or protected route (e.g., `/admin`).
    *   Authenticates securely (e.g., specific Google Account or Admin Password).
2.  **Dashboard Overview**:
    *   Owner sees a list of **Active Orders** by default.
    *   Columns visible: Date/Time, Customer Name, Phone Number, Total Amount, Status (Pending, Completed).

### Phase 2: Order Management
3.  **Reviewing an Order**:
    *   Owner clicks on a specific order row.
    *   A modal or detailed view opens showing:
        *   List of items ordered (Qty, Name, Special Instructions).
        *   Customer contact info (so they can call if an item is out of stock).
4.  **Completing an Order**:
    *   Kitchen prepares the food. Order is packed.
    *   Owner/Staff clicks a **"Mark as Complete"** button on the order detail view.

### Phase 3: System Automation
5.  **Automated Notification**:
    *   The system automatically sends the "Order Complete" email to the customer.
    *   The order status changes from "Pending" to "Completed" in the dashboard.
    *   (Optional) The order moves to a "Past Orders" tab.








Google SSO Implementation Plan
Goal Description
Implement "Login with Google" for mistaoh.com. This will allow users to sign in using their Google accounts, improving the user experience by reducing friction. The implementation will integrate with the existing custom JWT authentication system.

User Review Required
IMPORTANT

Google Cloud Console Setup Required You must set up a project in Google Cloud Console.

Go to Google Cloud Console.
Create a new project or select an existing one.
Navigate to APIs & Services > Credentials.
Click Create Credentials > OAuth client ID.
Application type: Web application.
Authorized JavaScript origins:
http://localhost:3000
https://www.mistaoh.com
Authorized redirect URIs:
http://localhost:3000/api/auth/google/callback
https://www.mistaoh.com/api/auth/google/callback
Copy the Client ID and Client Secret.
WARNING

Database Schema Change The 
User
 model currently requires a password and phone.

Google users won't have a password initially.
Google users might not provide a phone number.
Change: I will make password and phone optional in the Mongoose schema. Existing users are unaffected, but new Google users can be created without them.
Proposed Changes
Configuration
[MODIFY] 
.env
Add GOOGLE_CLIENT_ID
Add GOOGLE_CLIENT_SECRET
Add NEXT_PUBLIC_APP_URL (if not present, for redirect logic)
Database
[MODIFY] 
User.ts
Update UserSchema:
password: required: false (or conditional based on googleId)
phone: required: false (since Google might not return it)
Add googleId: String, unique, sparse
Add image: String (for profile picture)
API Routes
[NEW] 
route.ts
Handles the redirect to Google's OAuth 2.0 endpoint.
[NEW] 
route.ts
Exchanges authorization code for tokens.
Retrieves user profile from Google.
Finds or creates user in MongoDB.
Generates JWT (reusing signJWT from lib/auth).
Sets the auth cookie.
Redirects user to homepage.
Frontend
[MODIFY] 
page.tsx
Add a separator and "Sign in with Google" button.
[MODIFY] 
page.tsx
Add "Sign up with Google" button.
Verification Plan
Automated Tests
None existing for auth flow that I can run easily without mocking Google.
Manual Verification
Setup:
User adds GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to 
.env
.
Login Flow:
Go to /login.
Click "Sign in with Google".
Complete Google login.
Verify redirect to /.
Verify user session is active (name appears in menu).
Check MongoDB to confirm user creation (if new) or linking (if email matches).
Edge Cases:
Try logging in with a Google email that already exists as a password-user (should link or log in).



