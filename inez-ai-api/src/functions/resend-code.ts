import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { users, verificationCodes, generateVerificationCode, sendVerificationEmail } from '../shared/utils';

app.http('resend-code', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            const body = await request.json() as { email: string };
            const { email } = body;

            // Validate input
            if (!email) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'Email is required' })
                };
            }

            // Check if user exists and is not verified
            const user = users.find(u => u.email === email);
            if (!user) {
                return {
                    status: 404,
                    body: JSON.stringify({ message: 'User not found' })
                };
            }

            if (user.isVerified) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'User is already verified' })
                };
            }

            // Remove any existing verification codes for this email
            const existingCodeIndex = verificationCodes.findIndex(entry => entry.email === email);
            if (existingCodeIndex > -1) {
                verificationCodes.splice(existingCodeIndex, 1);
            }

            // Generate new verification code
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
                status: 200,
                body: JSON.stringify({ 
                    message: 'Verification code resent successfully',
                    verificationCode: verificationCode // Only in development
                })
            };
        } catch (error) {
            context.error('Resend code error:', error);
            return {
                status: 500,
                body: JSON.stringify({ message: 'Internal server error' })
            };
        }
    }
});
