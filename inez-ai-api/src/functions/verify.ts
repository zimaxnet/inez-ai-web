import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { users, verificationCodes } from '../shared/utils';

app.http('verify', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            const body = await request.json() as { email: string; code: string };
            const { email, code } = body;

            // Validate input
            if (!email || !code) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'Email and verification code are required' })
                };
            }

            // Find the verification code
            const verificationEntry = verificationCodes.find(
                entry => entry.email === email && entry.code === code
            );

            if (!verificationEntry) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'Invalid verification code' })
                };
            }

            // Check if code is expired
            if (new Date() > new Date(verificationEntry.expiresAt)) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'Verification code has expired' })
                };
            }

            // Find and update user
            const user = users.find(u => u.email === email);
            if (!user) {
                return {
                    status: 404,
                    body: JSON.stringify({ message: 'User not found' })
                };
            }

            user.isVerified = true;

            // Remove the verification code
            const codeIndex = verificationCodes.findIndex(entry => entry.email === email);
            if (codeIndex > -1) {
                verificationCodes.splice(codeIndex, 1);
            }

            return {
                status: 200,
                body: JSON.stringify({ message: 'Email verified successfully' })
            };
        } catch (error) {
            context.error('Verification error:', error);
            return {
                status: 500,
                body: JSON.stringify({ message: 'Internal server error' })
            };
        }
    }
});
