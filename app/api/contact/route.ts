import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Format subject for display
        const subjectLabels: Record<string, string> = {
            reservation: 'Reservation Inquiry',
            catering: 'Catering Inquiry',
            menu: 'Menu Question',
            feedback: 'Feedback',
            other: 'Other',
        };

        // Create email content
        const emailContent = `
New Contact Message from Mista Oh Website

===========================================
CONTACT INFORMATION
===========================================
Full Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

===========================================
INQUIRY DETAILS
===========================================
Subject: ${subjectLabels[subject] || subject}

===========================================
MESSAGE
===========================================
${message}

-------------------------------------------
This message was submitted through the Mista Oh website contact form.
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
    .message-box { background-color: #fff; padding: 15px; border-left: 4px solid #DAA520; margin-top: 10px; }
    .footer { background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✉️ New Contact Message</h1>
    </div>
    <div class="content">
      <div class="section">
        <h2>Contact Information</h2>
        <div class="field"><strong>Full Name:</strong> ${name}</div>
        <div class="field"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></div>
        <div class="field"><strong>Phone:</strong> ${phone ? `<a href="tel:${phone}">${phone}</a>` : 'Not provided'}</div>
      </div>
      <div class="section">
        <h2>Inquiry Details</h2>
        <div class="field"><strong>Subject:</strong> ${subjectLabels[subject] || subject}</div>
      </div>
      <div class="section">
        <h2>Message</h2>
        <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      This message was submitted through the Mista Oh website contact form.
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
            subject: `Contact Form: ${subjectLabels[subject] || subject} - ${name}`,
            text: emailContent,
            html: htmlContent,
        });

        return NextResponse.json(
            { success: true, message: 'Message sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending contact message:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again or contact us directly.' },
            { status: 500 }
        );
    }
}
