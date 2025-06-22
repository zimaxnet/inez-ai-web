import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const users: any[] = [];
const verificationCodes: any[] = [];

// Email configuration (using Gmail for demo - replace with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Generate 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email: string, code: string) => {
  // For development, just log the code instead of sending email
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

// Routes

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (not verified yet)
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      verified: false,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate and store verification code
    const verificationCode = generateVerificationCode();
    verificationCodes.push({
      email,
      code: verificationCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // In development mode, also return the code in the response
    const responseData: any = { 
      message: 'Registration successful. Please check your email for verification code.',
      email 
    };

    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
      responseData.verificationCode = verificationCode;
      responseData.message = 'Registration successful. Use the verification code below:';
    }

    res.status(201).json(responseData);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify email with code
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find verification code
    const verification = verificationCodes.find(v => 
      v.email === email && 
      v.code === code && 
      new Date() < v.expiresAt
    );

    if (!verification) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Mark user as verified
    user.verified = true;

    // Remove used verification code
    const codeIndex = verificationCodes.findIndex(v => v.email === email && v.code === code);
    if (codeIndex > -1) {
      verificationCodes.splice(codeIndex, 1);
    }

    res.json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Resend verification code
app.post('/api/auth/resend-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Remove old verification codes for this user
    const oldCodesIndex = verificationCodes.findIndex(v => v.email === email);
    if (oldCodesIndex > -1) {
      verificationCodes.splice(oldCodesIndex, 1);
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    verificationCodes.push({
      email,
      code: verificationCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send new verification email
    await sendVerificationEmail(email, verificationCode);

    res.json({ message: 'Verification code resent successfully' });

  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login with email/password
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 