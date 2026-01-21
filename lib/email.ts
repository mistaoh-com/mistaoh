import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendOrderConfirmationEmail(
  to: string,
  customerName: string,
  items: any[],
  total: number,
  orderId: string,
  isSubscription: boolean = false
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
          <tr>
            <td style="padding: 10px; text-align: right; font-weight: bold;">Total</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">
              ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
            </td>
          </tr>
        </table>
      </div>

      <p>If you have any questions, please contact us at (646) 559-8858 or reply to this email.</p>
      
      <p>Best regards,<br/>Mista Oh Team</p>
    </div>
  `

  await transporter.sendMail({
    from: `"Mista Oh" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  })
}
