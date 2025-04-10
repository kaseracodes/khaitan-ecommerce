const { Resend } = require('resend');

const { RESEND_API_KEY, FROM_EMAIL, OTP_TTL } = require("../config/server_config")

const resend = new Resend(RESEND_API_KEY);

async function sendEmail(to, subject, htmlContent, attachments = []) {
  try {
    const emailData = {
      from: FROM_EMAIL,
      to,
      subject,
      html: htmlContent,
    };

    // If there are attachments, add them as base64 content
    if (attachments.length > 0) {
      emailData.attachments = attachments.map(({ filename, content }) => ({
        filename,
        content: content.toString('base64'), // Convert buffer to Base64
      }));
    }

    const response = await resend.emails.send(emailData);
    console.log('Email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function sendSignupOTPEmail(to, otp) {
  const subject = 'Your Signup OTP Code';
  const htmlContent = `<p>Your OTP code is <strong>${otp}</strong>. It is valid for ${OTP_TTL} seconds.</p>`;
  return sendEmail(to, subject, htmlContent);
}

async function sendPasswordResetLinkEmail(to, resetLink) {
  const subject = 'Password Reset Request';
  const htmlContent = `
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>If you didn’t request a password reset, reach out to us at developers@khaitan.com</p>
  `;
  return sendEmail(to, subject, htmlContent);
}

async function sendPasswordResetTokenEmail(to, token) {
  const subject = 'Password Reset Request';
  const htmlContent = `
    <p>Use this password reset token to be able to reset your password</p>
    <p>Token = <strong>${token}</strong> </p>
    <p>If you didn’t request a password reset, reach out to us at developers@khaitan.com</p>
    <p>Thank you,<br/>Team Khaitan</p>
  `;
  return sendEmail(to, subject, htmlContent);
}

async function sendPasswordResetConfirmationEmail(to) {
  const subject = 'Your Password Was Successfully Reset';
  const htmlContent = `
    <p>Hello,</p>
    <p>Your password has been successfully reset. If you did not perform this action, please contact our support team immediately at <a href="mailto:developers@khaitan.com">developers@khaitan.com</a>.</p>
    <p>Thank you,<br/>Team Khaitan</p>
  `;
  return sendEmail(to, subject, htmlContent);
}

async function sendOrderConfirmationEmail(to, order, userName) {
  const subject = '🎉 Order Confirmed – Khaitan';
  const htmlContent = `
    <p>Hi ${userName || 'Customer'},</p>
    <p>Thank you for your order! Your payment has been confirmed successfully.</p>

    <h3>🧾 Order Details</h3>
    <ul>
      <li><strong>Order ID:</strong> ${order.id}</li>
      <li><strong>Total Price:</strong> ₹${order.totalPrice}</li>
      <li><strong>Status:</strong> ${order.status}</li>
      <li><strong>Delivery Status:</strong> ${order.deliveryStatus}</li>
      <li><strong>Expected Delivery:</strong> ${new Date(order.expectedDeliveryDate).toLocaleDateString()}</li>
      <li><strong>Delivery Address:</strong> ${order.deliveryAddress}</li>
    </ul>

    <p>If you have any questions, reply to this email or contact <a href="mailto:developers@khaitan.com">developers@khaitan.com</a>.</p>
    <p>Cheers,<br/>Team Khaitan</p>
  `;

  return sendEmail(to, subject, htmlContent);
}

module.exports = { 
  sendEmail, 
  sendSignupOTPEmail, 
  sendPasswordResetLinkEmail, 
  sendPasswordResetTokenEmail ,
  sendPasswordResetConfirmationEmail,
  sendOrderConfirmationEmail
};
