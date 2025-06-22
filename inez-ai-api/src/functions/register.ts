import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { users, verificationCodes, generateVerificationCode, sendVerificationEmail, hashPassword } from '../shared/utils';

app.http('register', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            const body = await request.json() as { email: string; password: string; firstName: string; lastName: string };
            const { email, password, firstName, lastName } = body;

            // Validate input
            if (!email || !password || !firstName || !lastName) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'All fields are required' })
                };
            }

            // Check if user already exists
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                return {
                    status: 409,
                    body: JSON.stringify({ message: 'User already exists' })
                };
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Create user
            const newUser = {
                id: Date.now().toString(),
                email,
                password: hashedPassword,
                firstName,
                lastName,
                isVerified: false,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);

            // Generate verification code
            const verificationCode = generateVerificationCode();
            verificationCodes.push({
                email,
                code: verificationCode,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
            });

            // Send verification email
            await sendVerificationEmail(email, verificationCode);

            return {
                status: 201,
                body: JSON.stringify({ 
                    message: 'Registration successful. Please check your email for verification code.',
                    verificationCode: verificationCode // Only in development
                })
            };
        } catch (error) {
            context.error('Registration error:', error);
            return {
                status: 500,
                body: JSON.stringify({ message: 'Internal server error' })
            };
        }
    }
});
