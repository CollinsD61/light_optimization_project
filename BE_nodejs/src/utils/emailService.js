const nodemailer = require('nodemailer');
const config = require('../config/config');

// Tạo transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: config.email.auth
  });
};

// Gửi email reset password
const sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${config.frontend.url}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p style="margin-top: 20px;">If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
      text: `Click the link to reset your password: ${resetUrl}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail
};

