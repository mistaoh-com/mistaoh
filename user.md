# User Journeys

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
