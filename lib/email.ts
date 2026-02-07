import nodemailer from "nodemailer"
import { MailItem } from "./types"

let transporter: any = null

function getTransporter() {
  if (transporter) return transporter

  const user = process.env.MAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!user || !pass) {
    console.error("❌ EMAIL ERROR: MAIL_USER or EMAIL_PASS environment variables are missing.")
    throw new Error("Missing email credentials. Please ensure MAIL_USER and EMAIL_PASS are set in Vercel environment variables.")
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  })

  return transporter
}

export async function sendOrderConfirmationEmail(
  to: string,
  customerName: string,
  items: MailItem[],
  total: number,
  orderId: string,
  isSubscription: boolean = false,
  subtotal?: number,
  taxAmount?: number
) {
  const subject = isSubscription
    ? `Subscription Confirmation - Order #${orderId.slice(-8)}`
    : `Order Confirmation - Order #${orderId.slice(-8)}`

  const itemsList = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.title}</strong><br/>
            <span style="color: #666; font-size: 14px;">${item.description || "Quantity: " + item.quantity}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price * (item.quantity || 1))}
          </td>
        </tr>`
    )
    .join("")

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">${isSubscription ? "Subscription Activated!" : "Thank You for Your Order!"}</h1>
      <p>Hi ${customerName},</p>
      <p>We've received your payment and your order is being processed.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p>Order ID: ${orderId}</p>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsList}
          ${subtotal !== undefined && taxAmount !== undefined ? `
          <tr>
            <td style="padding: 10px; text-align: right; color: #666;">Subtotal</td>
            <td style="padding: 10px; text-align: right; color: #666;">
              ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal)}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; text-align: right; color: #666;">Tax (8.75%)</td>
            <td style="padding: 10px; text-align: right; color: #666;">
              ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(taxAmount)}
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #333;">Total</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #333;">
              ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
            </td>
          </tr>
        </table>
      </div>

      <p>If you have any questions, please contact us or reply to this email.</p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px; margin-bottom: 8px;">
          <strong>Pickup Location:</strong>
        </p>
        <p style="color: #666; font-size: 14px; margin: 0;">
          <a href="https://maps.app.goo.gl/C8AwBiLr3xCwp6Lp9"
             style="color: #FF813D; text-decoration: none;">
            41 West 24th Street, New York, NY 10010<br>
            (between 5th and 6th Ave)
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 8px;">
          Phone: <a href="tel:6465598858" style="color: #FF813D; text-decoration: none;">(646) 559-8858</a>
        </p>
      </div>

      <p style="margin-top: 20px;">Best regards,<br/>Mista Oh Team</p>
    </div>
  `

  await getTransporter().sendMail({
    from: `"Mista Oh" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  })
}

export async function sendVerificationEmail(to: string, token: string) {
  const subject = "Verify your Mista Oh Account"
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome to Mista Oh!</h1>
      <p>Please verify your email address to complete your registration based on the email provided.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #FF813D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
      </div>

      <p>Or click this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
      
      <p>If you didn't create an account, please ignore this email.</p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px; margin-bottom: 8px;">
          <strong>Visit Us:</strong>
        </p>
        <p style="color: #666; font-size: 14px; margin: 0;">
          <a href="https://maps.app.goo.gl/C8AwBiLr3xCwp6Lp9"
             style="color: #FF813D; text-decoration: none;">
            41 West 24th Street, New York, NY 10010<br>
            (between 5th and 6th Ave)
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 8px;">
          Phone: <a href="tel:6465598858" style="color: #FF813D; text-decoration: none;">(646) 559-8858</a>
        </p>
      </div>

      <p style="margin-top: 20px;">Best regards,<br/>Mista Oh Team</p>
    </div>
  `

  await getTransporter().sendMail({
    from: `"Mista Oh" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  })
}

export async function sendOrderStatusEmail(to: string, customerName: string, orderId: string, status: string) {
  const subject = `Order Update - Order #${orderId.slice(-8)} is ${status}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Order Update</h1>
      <p>Hi ${customerName},</p>
      <p>Your order <strong>#${orderId.slice(-8)}</strong> has been updated to:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="background-color: #FF813D; color: white; padding: 12px 24px; border-radius: 4px; font-weight: bold; font-size: 18px;">
          ${status}
        </span>
      </div>

      <p>You can view your order status in your dashboard.</p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px; margin-bottom: 8px;">
          <strong>Pickup Location:</strong>
        </p>
        <p style="color: #666; font-size: 14px; margin: 0;">
          <a href="https://maps.app.goo.gl/C8AwBiLr3xCwp6Lp9"
             style="color: #FF813D; text-decoration: none;">
            41 West 24th Street, New York, NY 10010<br>
            (between 5th and 6th Ave)
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 8px;">
          Phone: <a href="tel:6465598858" style="color: #FF813D; text-decoration: none;">(646) 559-8858</a>
        </p>
      </div>

      <p style="margin-top: 20px;">Best regards,<br/>Mista Oh Team</p>
    </div>
  `

  await getTransporter().sendMail({
    from: `"Mista Oh" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  })
}

export async function sendAdminNewOrderEmail(
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  orderId: string,
  items: MailItem[],
  total: number,
  specialInstructions?: string,
  subtotal?: number,
  taxAmount?: number
) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_USER
  const subject = `[NEW ORDER] #${orderId.slice(-8)} - ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}`

  const itemsList = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.title}</strong> x ${item.quantity}<br/>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price * (item.quantity || 1))}
          </td>
        </tr>`
    )
    .join("")

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h1 style="color: #D32F2F;">New Order Received!</h1>
      <p style="font-size: 16px;"><strong>Order ID:</strong> #${orderId.slice(-8)}</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">Customer Details</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${customerName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${customerPhone}">${customerPhone || "N/A"}</a></p>
      </div>

      <h3 style="color: #333;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        ${itemsList}
        ${subtotal !== undefined && taxAmount !== undefined ? `
        <tr>
          <td style="padding: 10px; text-align: right; color: #666; border-bottom: 1px solid #eee;">Subtotal</td>
          <td style="padding: 10px; text-align: right; color: #666; border-bottom: 1px solid #eee;">
            ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal)}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; text-align: right; color: #666; border-bottom: 1px solid #eee;">Tax (8.75%)</td>
          <td style="padding: 10px; text-align: right; color: #666; border-bottom: 1px solid #eee;">
            ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(taxAmount)}
          </td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #333;">Total Amount</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #333;">
            ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
          </td>
        </tr>
      </table>

      ${specialInstructions ? `
      <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #ff9800;">
        <h3 style="margin-top: 0; color: #e65100;">Special Instructions</h3>
        <p style="margin: 0;">${specialInstructions}</p>
      </div>
      ` : ""}

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View in Dashboard</a>
      </div>
    </div>
  `

  if (adminEmail) {
    await getTransporter().sendMail({
      from: `"Mista Oh System" <${process.env.MAIL_USER}>`,
      to: adminEmail,
      subject,
      html,
    })
  }
}

export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_USER
  if (!adminEmail) return

  const subjectLabels: Record<string, string> = {
    reservation: "Reservation Inquiry",
    catering: "Catering Inquiry",
    menu: "Menu Question",
    feedback: "Feedback",
    other: "Other",
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #FF813D; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Contact Message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
      <p><strong>Subject:</strong> ${subjectLabels[data.subject] || data.subject}</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p style="margin-top: 0; font-weight: bold;">Message:</p>
        <p style="white-space: pre-wrap;">${data.message}</p>
      </div>
    </div>
  `

  await getTransporter().sendMail({
    from: `"Mista Oh Website" <${process.env.MAIL_USER}>`,
    to: adminEmail,
    replyTo: data.email,
    subject: `[Contact Form] ${subjectLabels[data.subject] || data.subject} - ${data.name}`,
    html,
  })
}

export async function sendContactAcknowledgementEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const subjectLabels: Record<string, string> = {
    reservation: "Reservation Inquiry",
    catering: "Catering Inquiry",
    menu: "Menu Question",
    feedback: "Feedback",
    other: "Other",
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f5f5f7;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }
        .content {
          padding: 48px;
        }
        .header {
          margin-bottom: 32px;
        }
        .logo {
          font-size: 24px;
          font-weight: 600;
          color: #1d1d1f;
          letter-spacing: -0.02em;
        }
        h1 {
          font-size: 28px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 16px 0;
          letter-spacing: -0.01em;
        }
        p {
          font-size: 17px;
          line-height: 1.5;
          color: #424245;
          margin: 0 0 24px 0;
        }
        .details-box {
          background-color: #fbfbfd;
          border: 1px solid #d2d2d7;
          border-radius: 12px;
          padding: 24px;
          margin-top: 32px;
        }
        .details-title {
          font-size: 14px;
          font-weight: 600;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }
        .detail-item {
          margin-bottom: 12px;
          font-size: 15px;
        }
        .detail-label {
          color: #86868b;
          width: 80px;
          display: inline-block;
        }
        .detail-value {
          color: #1d1d1f;
          font-weight: 500;
        }
        .message-content {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e5e5;
          font-style: italic;
          color: #424245;
        }
        .footer {
          padding: 32px 48px;
          background-color: #f5f5f7;
          text-align: center;
          font-size: 12px;
          color: #86868b;
        }
        .footer a {
          color: #0066cc;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <div class="header">
            <span class="logo">Mista Oh</span>
          </div>
          <h1>Thank you for reaching out.</h1>
          <p>Hi ${data.name},</p>
          <p>We've received your message and will get back to you as soon as possible. Our team usually responds within 24 hours.</p>
          
          <div class="details-box">
            <div class="details-title">Your Inquiry Details</div>
            <div class="detail-item">
              <span class="detail-label">Subject:</span>
              <span class="detail-value">${subjectLabels[data.subject] || data.subject}</span>
            </div>
            <div class="message-content">
              "${data.message}"
            </div>
          </div>
        </div>
        <div class="footer">
          <a href="https://maps.app.goo.gl/C8AwBiLr3xCwp6Lp9"
             style="color: #0066cc; text-decoration: none;">
            41 West 24th Street, New York, NY 10010<br>
            (between 5th and 6th Ave)
          </a><br>
          <a href="tel:6465598858">(646) 559-8858</a> &nbsp;•&nbsp; <a href="https://mistaoh.com">mistaoh.com</a>
        </div>
      </div>
    </body>
    </html>
  `

  await getTransporter().sendMail({
    from: `"Mista Oh" <${process.env.MAIL_USER}>`,
    to: data.email,
    subject: `Thank you for contacting Mista Oh`,
    html,
  })
}

export async function sendCateringEmail(data: {
  name: string
  email: string
  phone: string
  eventDate: string
  guestCount: string
  eventType: string
  message?: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_USER
  if (!adminEmail) return

  const eventTypeLabels: Record<string, string> = {
    corporate: "Corporate Event",
    wedding: "Wedding",
    birthday: "Birthday Party",
    family: "Family Gathering",
    other: "Other",
  }

  const formattedDate = new Date(data.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #FF813D; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Catering Inquiry</h2>
      <div style="margin-bottom: 20px;">
        <h3 style="color: #333;">Contact Info</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="color: #333;">Event Details</h3>
        <p><strong>Type:</strong> ${eventTypeLabels[data.eventType] || data.eventType}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Guests:</strong> ${data.guestCount}</p>
      </div>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p style="margin-top: 0; font-weight: bold;">Additional Details:</p>
        <p style="white-space: pre-wrap;">${data.message || "No additional details provided."}</p>
      </div>
    </div>
  `

  await getTransporter().sendMail({
    from: `"Mista Oh Website" <${process.env.MAIL_USER}>`,
    to: adminEmail,
    replyTo: data.email,
    subject: `[Catering Inquiry] ${eventTypeLabels[data.eventType] || data.eventType} - ${data.name}`,
    html,
  })
}

export async function sendCateringAcknowledgementEmail(data: {
  name: string
  email: string
  phone: string
  eventDate: string
  guestCount: string
  eventType: string
  message?: string
}) {
  const eventTypeLabels: Record<string, string> = {
    corporate: "Corporate Event",
    wedding: "Wedding",
    birthday: "Birthday Party",
    family: "Family Gathering",
    other: "Other",
  }

  const formattedDate = new Date(data.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f5f5f7;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }
        .content {
          padding: 48px;
        }
        .header {
          margin-bottom: 32px;
        }
        .logo {
          font-size: 24px;
          font-weight: 600;
          color: #1d1d1f;
          letter-spacing: -0.02em;
        }
        h1 {
          font-size: 28px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 16px 0;
          letter-spacing: -0.01em;
        }
        p {
          font-size: 17px;
          line-height: 1.5;
          color: #424245;
          margin: 0 0 24px 0;
        }
        .details-box {
          background-color: #fbfbfd;
          border: 1px solid #d2d2d7;
          border-radius: 12px;
          padding: 24px;
          margin-top: 32px;
        }
        .details-title {
          font-size: 14px;
          font-weight: 600;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }
        .detail-item {
          margin-bottom: 12px;
          font-size: 15px;
          display: flex;
          align-items: flex-start;
        }
        .detail-label {
          color: #86868b;
          width: 100px;
          flex-shrink: 0;
          display: inline-block;
        }
        .detail-value {
          color: #1d1d1f;
          font-weight: 500;
        }
        .message-content {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e5e5;
          font-style: italic;
          color: #424245;
        }
        .footer {
          padding: 32px 48px;
          background-color: #f5f5f7;
          text-align: center;
          font-size: 12px;
          color: #86868b;
        }
        .footer a {
          color: #0066cc;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <div class="header">
            <span class="logo">Mista Oh</span>
          </div>
          <h1>Catering request received.</h1>
          <p>Hi ${data.name},</p>
          <p>Thank you for your interest in catering with Mista Oh. We've received your request and our events team will review the details and get back to you with a quote within 24 hours.</p>
          
          <div class="details-box">
            <div class="details-title">Event Details</div>
            <div class="detail-item">
              <span class="detail-label">Type:</span>
              <span class="detail-value">${eventTypeLabels[data.eventType] || data.eventType}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Guests:</span>
              <span class="detail-value">${data.guestCount}</span>
            </div>
            ${data.message ? `
            <div class="message-content">
              "${data.message}"
            </div>
            ` : ""}
          </div>
        </div>
        <div class="footer">
          <a href="https://maps.app.goo.gl/C8AwBiLr3xCwp6Lp9"
             style="color: #0066cc; text-decoration: none;">
            41 West 24th Street, New York, NY 10010<br>
            (between 5th and 6th Ave)
          </a><br>
          <a href="tel:6465598858">(646) 559-8858</a> &nbsp;•&nbsp; <a href="https://mistaoh.com/catering">mistaoh.com/catering</a>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"Mista Oh" <${process.env.MAIL_USER}>`,
    to: data.email,
    subject: `We've received your catering request`,
    html,
  })
}
