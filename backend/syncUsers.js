import { createClerkClient } from '@clerk/backend';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { StreamChat } from 'stream-chat';

dotenv.config({ path: './.env' });

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const streamClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  profileImage: { type: String },
});

const User = mongoose.model('User', userSchema);

async function sync() {
  try {
    const streamUsers = [];
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to DB');
    
    // Using simple fetch since clerk SDK syntax varies between v4/v5 and we want it to work regardless
    const response = await fetch('https://api.clerk.com/v1/users', {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    });

    const data = await response.json();
    console.log(`Found ${data.length} users in Clerk`);

    for (const clerkUser of data) {
      const email = clerkUser.email_addresses[0]?.email_address || '';
      const name = `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || 'Anonymous';
      const userDoc = {
        clerkId: clerkUser.id,
        email: email,
        name: name,
        profileImage: clerkUser.image_url
      };

      await User.findOneAndUpdate({ clerkId: clerkUser.id }, userDoc, { upsert: true });
      console.log(`Synced user: ${name} to MongoDB`);
      
      streamUsers.push({
        id: clerkUser.id.toString(),
        name: name,
        image: clerkUser.image_url,
      });
    }

    if (streamUsers.length > 0) {
      await streamClient.upsertUsers(streamUsers);
      console.log(`Synced ${streamUsers.length} users to Stream API`);
    }

    console.log('Sync complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

sync();
