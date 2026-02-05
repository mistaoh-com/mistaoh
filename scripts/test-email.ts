import { sendContactEmail, sendContactAcknowledgementEmail, sendCateringEmail, sendCateringAcknowledgementEmail } from "../lib/email";

// Built-in environment variable support in recent Node.js versions
// or run with -r dotenv/config

async function main() {
    console.log("Starting email verification test...");
    console.log("Using MAIL_USER:", process.env.MAIL_USER);
    console.log("Using ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

    const testData = {
        name: "Verification Test",
        email: "test@example.com",
        phone: "123-456-7890",
        subject: "feedback",
        message: "This is a test message to verify the contact form email implementation. If you see this, the implementation is working correctly.",
    };

    try {
        console.log("Sending admin email...");
        await sendContactEmail(testData);
        console.log("✅ Admin email logic verified");

        console.log("Sending customer acknowledgement email...");
        await sendContactAcknowledgementEmail(testData);
        console.log("✅ Customer acknowledgement logic verified");

        console.log("\n--- Catering Form Test ---");
        const cateringData = {
            name: "Catering Test User",
            email: "test@example.com",
            phone: "123-456-7890",
            eventDate: "2026-06-01",
            guestCount: "50",
            eventType: "corporate",
            message: "This is a catering test message.",
        };

        console.log("Sending catering admin email...");
        await sendCateringEmail(cateringData);
        console.log("✅ Catering admin logic verified");

        console.log("Sending catering acknowledgement email...");
        await sendCateringAcknowledgementEmail(cateringData);
        console.log("✅ Catering acknowledgement logic verified");

        console.log("\nAll email logic verified successfully!");
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
}

main();
