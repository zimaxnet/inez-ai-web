import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { users, comparePassword, generateToken } from '../shared/utils';

app.http('login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            const body = await request.json() as { email: string; password: string };
            const { email, password } = body;

            if (!email || !password) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'Email and password are required' })
                };
            }

            // Find user
            const user = users.find(u => u.email === email);
            if (!user) {
                return {
                    status: 401,
                    body: JSON.stringify({ message: 'Invalid credentials' })
                };
            }

            // Check if user is verified
            if (!user.isVerified) {
                return {
                    status: 401,
                    body: JSON.stringify({ message: 'Please verify your email before logging in' })
                };
            }

            // Check password
            const isValidPassword = await comparePassword(password, user.password);
            if (!isValidPassword) {
                return {
                    status: 401,
                    body: JSON.stringify({ message: 'Invalid credentials' })
                };
            }

            // Generate JWT token
            const token = generateToken(user.id, user.email);

            return {
                status: 200,
                body: JSON.stringify({
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                })
            };

        } catch (error) {
            context.error('Login error:', error);
            return {
                status: 500,
                body: JSON.stringify({ message: 'Internal server error' })
            };
        }
    }
});
