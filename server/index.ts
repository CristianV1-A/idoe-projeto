import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/index.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User registration
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;
    console.log('Creating user:', { name, email, phone, location });
    
    const user = await db.insertInto('users')
      .values({ name, email, phone, location })
      .returningAll()
      .executeTakeFirst();
    
    console.log('User created:', user);
    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by email
app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Finding user by email:', email);
    
    const user = await db.selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found:', user);
    res.json(user);
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Failed to find user' });
  }
});

// Create clothing item
app.post('/api/clothing-items', async (req, res) => {
  try {
    const { user_id, title, description, category, size, condition, image_url } = req.body;
    console.log('Creating clothing item:', { user_id, title, category, size, condition });
    
    const item = await db.insertInto('clothing_items')
      .values({ user_id, title, description, category, size, condition, image_url })
      .returningAll()
      .executeTakeFirst();
    
    console.log('Clothing item created:', item);
    res.json(item);
  } catch (error) {
    console.error('Error creating clothing item:', error);
    res.status(500).json({ error: 'Failed to create clothing item' });
  }
});

// Get all available clothing items
app.get('/api/clothing-items', async (req, res) => {
  try {
    console.log('Fetching all clothing items');
    
    const items = await db.selectFrom('clothing_items')
      .innerJoin('users', 'users.id', 'clothing_items.user_id')
      .select([
        'clothing_items.id',
        'clothing_items.title',
        'clothing_items.description',
        'clothing_items.category',
        'clothing_items.size',
        'clothing_items.condition',
        'clothing_items.image_url',
        'clothing_items.created_at',
        'users.name as donor_name',
        'users.location as donor_location'
      ])
      .where('clothing_items.is_available', '=', true)
      .orderBy('clothing_items.created_at', 'desc')
      .execute();
    
    console.log('Found clothing items:', items.length);
    res.json(items);
  } catch (error) {
    console.error('Error fetching clothing items:', error);
    res.status(500).json({ error: 'Failed to fetch clothing items' });
  }
});

// Get clothing item by ID
app.get('/api/clothing-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching clothing item:', id);
    
    const item = await db.selectFrom('clothing_items')
      .innerJoin('users', 'users.id', 'clothing_items.user_id')
      .select([
        'clothing_items.id',
        'clothing_items.user_id',
        'clothing_items.title',
        'clothing_items.description',
        'clothing_items.category',
        'clothing_items.size',
        'clothing_items.condition',
        'clothing_items.image_url',
        'clothing_items.created_at',
        'users.name as donor_name',
        'users.location as donor_location'
      ])
      .where('clothing_items.id', '=', parseInt(id))
      .executeTakeFirst();
    
    if (!item) {
      return res.status(404).json({ error: 'Clothing item not found' });
    }
    
    console.log('Clothing item found:', item);
    res.json(item);
  } catch (error) {
    console.error('Error fetching clothing item:', error);
    res.status(500).json({ error: 'Failed to fetch clothing item' });
  }
});

// Create or get chat
app.post('/api/chats', async (req, res) => {
  try {
    const { clothing_item_id, donor_id, requester_id } = req.body;
    console.log('Creating/finding chat:', { clothing_item_id, donor_id, requester_id });
    
    // Check if chat already exists
    let chat = await db.selectFrom('chats')
      .selectAll()
      .where('clothing_item_id', '=', clothing_item_id)
      .where('donor_id', '=', donor_id)
      .where('requester_id', '=', requester_id)
      .executeTakeFirst();
    
    if (!chat) {
      chat = await db.insertInto('chats')
        .values({ clothing_item_id, donor_id, requester_id })
        .returningAll()
        .executeTakeFirst();
    }
    
    console.log('Chat found/created:', chat);
    res.json(chat);
  } catch (error) {
    console.error('Error creating/finding chat:', error);
    res.status(500).json({ error: 'Failed to create/find chat' });
  }
});

// Get chats for user
app.get('/api/chats/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching chats for user:', userId);
    
    const chats = await db.selectFrom('chats')
      .innerJoin('clothing_items', 'clothing_items.id', 'chats.clothing_item_id')
      .innerJoin('users as donor', 'donor.id', 'chats.donor_id')
      .innerJoin('users as requester', 'requester.id', 'chats.requester_id')
      .select([
        'chats.id',
        'chats.clothing_item_id',
        'chats.donor_id',
        'chats.requester_id',
        'chats.created_at',
        'clothing_items.title as item_title',
        'donor.name as donor_name',
        'requester.name as requester_name'
      ])
      .where((eb) => eb.or([
        eb('chats.donor_id', '=', parseInt(userId)),
        eb('chats.requester_id', '=', parseInt(userId))
      ]))
      .orderBy('chats.created_at', 'desc')
      .execute();
    
    console.log('Found chats:', chats.length);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Send message
app.post('/api/messages', async (req, res) => {
  try {
    const { chat_id, sender_id, content } = req.body;
    console.log('Sending message:', { chat_id, sender_id, content });
    
    const message = await db.insertInto('messages')
      .values({ chat_id, sender_id, content })
      .returningAll()
      .executeTakeFirst();
    
    console.log('Message sent:', message);
    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages for chat
app.get('/api/messages/chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    console.log('Fetching messages for chat:', chatId);
    
    const messages = await db.selectFrom('messages')
      .innerJoin('users', 'users.id', 'messages.sender_id')
      .select([
        'messages.id',
        'messages.chat_id',
        'messages.sender_id',
        'messages.content',
        'messages.created_at',
        'users.name as sender_name'
      ])
      .where('messages.chat_id', '=', parseInt(chatId))
      .orderBy('messages.created_at', 'asc')
      .execute();
    
    console.log('Found messages:', messages.length);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}
