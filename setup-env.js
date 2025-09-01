#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ExtraLife Dashboard Environment Setup\n');

const envPath = path.join(process.cwd(), '.env.local');
const envExample = `# Clerk Authentication
# Get this from https://clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Extra Life API
# This is your Extra Life participant ID (found in your Extra Life profile URL)
NEXT_PUBLIC_DONORDRIVE_ID=your_donordrive_participant_id_here

# Convex Database
# Get this from your Convex dashboard
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here

# Ably (for real-time features)
# Get this from https://ably.com/
NEXT_PUBLIC_ABLY_API_KEY=your_ably_api_key_here
`;

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
} else {
  fs.writeFileSync(envPath, envExample);
  console.log('✅ Created .env.local file');
}

console.log('\n📋 Next steps:');
console.log('1. Edit .env.local and add your actual values');
console.log('2. Set up Clerk authentication at https://clerk.com/');
console.log('3. Set up Convex database at https://convex.dev/');
console.log('4. Get your Extra Life participant ID from your profile');
console.log('5. Run "npm run dev" to start the development server');
console.log('\n📖 For more help, see the README.md file');
