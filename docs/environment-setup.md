# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-at-least-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# Optional: For production
# NEXTAUTH_URL=https://your-production-domain.com
\`\`\`

## Google OAuth Setup Verification

Based on your Google Cloud Console configuration:

### ✅ Authorized Redirect URIs
- `http://localhost:3000/api/auth/callback/google` ✅ (for local development)
- `https://greenify-2d0f2.firebaseapp.com/__/auth/handler` (for Firebase hosting)

### ✅ Authorized JavaScript Origins
- `http://localhost` ✅ (for local development)
- `http://localhost:5000` (alternative port)
- `https://greenify-2d0f2.firebaseapp.com` (for Firebase hosting)

## Next Steps

1. **Create `.env.local` file** with the variables above
2. **Generate NEXTAUTH_SECRET**: Run `openssl rand -base64 32` or use any 32+ character string
3. **Restart your development server** after adding environment variables
4. **Test authentication** using the updated configuration

## Troubleshooting

If you encounter issues:
- Ensure all environment variables are set correctly
- Check that redirect URIs match exactly (including protocol and port)
- Verify that your domain is added to authorized origins
- Clear browser cache and cookies for localhost
\`\`\`

Now let me update the NextAuth configuration to work optimally with your Google OAuth setup:
