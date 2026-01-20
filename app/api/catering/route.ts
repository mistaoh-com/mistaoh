import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, eventDate, guestCount, eventType, message } = body;

        // Validate required fields
        if (!name || !email || !phone || !eventDate || !guestCount || !eventType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Format event type for display
        const eventTypeLabels: Record<string, string> = {
            corporate: 'Corporate Event',
            wedding: 'Wedding',
            birthday: 'Birthday Party',
            family: 'Family Gathering',
            other: 'Other',
        };

        // Format the date
        const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Create email content
        const emailContent = `
New Catering Inquiry from Mista Oh Website

===========================================
CONTACT INFORMATION
===========================================
Name: ${name}
Email: ${email}
Phone: ${phone}

===========================================
EVENT DETAILS
===========================================
Event Type: ${eventTypeLabels[eventType] || eventType}
Event Date: ${formattedDate}
Number of Guests: ${guestCount}

===========================================
ADDITIONAL DETAILS
===========================================
${message || 'No additional details provided.'}

-------------------------------------------
This inquiry was submitted through the Mista Oh website catering form.
    `.trim();

        // Create HTML email content for better formatting
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #DAA520; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .section { margin-bottom: 20px; }
    .section h2 { color: #DAA520; font-size: 18px; margin-bottom: 10px; border-bottom: 2px solid #DAA520; padding-bottom: 5px; }
    .field { margin-bottom: 8px; }
    .field strong { color: #555; }
    .footer { background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍴 New Catering Inquiry</h1>
    </div>
    <div class="content">
      <div class="section">
        <h2>Contact Information</h2>
        <div class="field"><strong>Name:</strong> ${name}</div>
        <div class="field"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></div>
        <div class="field"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></div>
      </div>
      <div class="section">
        <h2>Event Details</h2>
        <div class="field"><strong>Event Type:</strong> ${eventTypeLabels[eventType] || eventType}</div>
        <div class="field"><strong>Event Date:</strong> ${formattedDate}</div>
        <div class="field"><strong>Number of Guests:</strong> ${guestCount}</div>
      </div>
      <div class="section">
        <h2>Additional Details</h2>
        <p>${message || 'No additional details provided.'}</p>
      </div>
    </div>
    <div class="footer">
      This inquiry was submitted through the Mista Oh website catering form.
    </div>
  </div>
</body>
</html>
    `.trim();

        // Create transporter - Configure with your email service
        // For Gmail, you'll need to use an App Password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'mistaohnyc@gmail.com',
                pass: process.env.EMAIL_PASS, // Gmail App Password required
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"Mista Oh Website" <${process.env.EMAIL_USER || 'mistaohnyc@gmail.com'}>`,
            to: 'mistaohnyc@gmail.com',
            replyTo: email,
            subject: `Catering Inquiry: ${eventTypeLabels[eventType] || eventType} - ${name}`,
            text: emailContent,
            html: htmlContent,
        });

        return NextResponse.json(
            { success: true, message: 'Inquiry sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending catering inquiry:', error);
        return NextResponse.json(
            { error: 'Failed to send inquiry. Please try again or contact us directly.' },
            { status: 500 }
        );
    }
}
