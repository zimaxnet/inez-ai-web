import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

// In-memory storage (replace with Azure Table Storage or Cosmos DB in production)
export const users: any[] = [];
export const verificationCodes: any[] = [];

// Generate 6-digit verification code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Send verification email
export const sendVerificationEmail = async (email: string, code: string) => {
  // For development/production, just log the code instead of sending email
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
    console.log('=== DEVELOPMENT MODE ===');
    console.log(`Verification code for ${email}: ${code}`);
    console.log('=== END DEVELOPMENT MODE ===');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: email,
    subject: 'Verify your Inez AI account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to Inez AI!</h2>
        <p>Thank you for creating an account. Please use the following verification code to complete your registration:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4f46e5; font-size: 32px; margin: 0; letter-spacing: 4px;">${code}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">© 2024 Inez AI. All rights reserved.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
}; 