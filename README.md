# ExtraLife Dashboard

A Next.js dashboard for managing ExtraLife fundraising campaigns with real-time updates, goals tracking, and donation management.

## Features

- **Real-time Dashboard**: Live updates of donations, goals, and campaign progress
- **Goal Management**: Create and track fundraising goals
- **Donation Tracking**: Monitor incoming donations with donor information
- **Randomizer System**: Interactive donation-based randomizers
- **Segment Management**: Organize content by donation amounts
- **Rotator System**: Rotate through different content segments
- **Authentication**: Secure access with Clerk authentication
- **Database**: Powered by Convex for real-time data
- **Real-time Updates**: Ably integration for live notifications

## Prerequisites

- Node.js 18+ and pnpm
- ExtraLife DonorDrive account
- Clerk account for authentication
- Convex account for database
- Ably account for real-time features

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... # From Clerk Dashboard > API Keys
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev # From Clerk Dashboard > JWT Templates > "convex" template

# ExtraLife DonorDrive
NEXT_PUBLIC_DONORDRIVE_ID=your_donordrive_id # Your ExtraLife DonorDrive participant ID

# Convex Database
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud # From Convex Dashboard

# Ably Real-time
NEXT_PUBLIC_ABLY_API_KEY=your_ably_api_key # From Ably Dashboard
```

### Optional Variables

```bash
# Clerk URLs (defaults to /sign-in and /sign-up)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## Setup Instructions

### 1. Clerk JWT Template Setup

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **JWT Templates**
3. Click **New template**
4. Select **Convex** from the template list
5. **Important**: Do NOT rename the JWT token - it must be called `convex`
6. Copy the **Issuer URL** (Frontend API URL) - this is your `CLERK_JWT_ISSUER_DOMAIN`

### 2. Convex Auth Configuration

The project includes a `convex/auth.config.ts` file that's already configured for Clerk integration. After setting up your JWT template, run:

```bash
npx convex dev
```

This will sync the authentication configuration to your Convex backend.

### 3. Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
pnpm setup

# Start development server
pnpm dev
```

## Usage

1. **Sign In**: Navigate to `/sign-in` to authenticate with Clerk
2. **Dashboard**: Access the main dashboard at `/dashboard`
3. **Goals**: Manage fundraising goals at `/dashboard/goals`
4. **Randomizers**: Configure donation-based randomizers at `/dashboard/randomizer`
5. **Segments**: Organize content segments at `/dashboard/config`
6. **Schedule**: Manage content scheduling at `/dashboard/schedule`
7. **Debug**: Access debug information at `/dashboard/debug`

## API Routes

- `/api/goals` - Goal management
- `/api/randomizers` - Randomizer configuration
- `/api/segments` - Segment management
- `/api/rotator` - Rotator content
- `/api/randomizers/[id]/redemptions` - Randomizer redemptions

## Database Schema

The application uses Convex with the following main tables:

- `goals` - Fundraising goals
- `randomizers` - Donation-based randomizers
- `randomizerItems` - Items for randomizers
- `segments` - Content segments
- `rotators` - Rotating content
- `wheelRedemptions` - Wheel spin redemptions

## Troubleshooting

### Authentication Issues

1. **401 Unauthorized**: Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly
2. **Convex Auth Errors**: Verify `CLERK_JWT_ISSUER_DOMAIN` matches your Clerk JWT template issuer URL
3. **Missing JWT Template**: Make sure you've created a "convex" JWT template in Clerk

### Environment Variables

- **Missing Variables**: Use `pnpm setup` to create a template `.env.local` file
- **Invalid DonorDrive ID**: Ensure `NEXT_PUBLIC_DONORDRIVE_ID` is a valid number without special characters
- **Convex URL**: Verify `NEXT_PUBLIC_CONVEX_URL` is correct from your Convex dashboard

### Development Issues

- **CSS Not Loading**: Ensure PostCSS and Tailwind are properly configured
- **Real-time Not Working**: Check Ably API key and connection
- **Database Errors**: Run `npx convex dev` to sync schema changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
