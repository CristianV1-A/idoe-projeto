export interface DatabaseSchema {
  users: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    location: string | null;
    created_at: string;
  };
  clothing_items: {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    category: string;
    size: string;
    condition: string;
    image_url: string | null;
    is_available: boolean;
    created_at: string;
  };
  chats: {
    id: number;
    clothing_item_id: number;
    donor_id: number;
    requester_id: number;
    created_at: string;
  };
  messages: {
    id: number;
    chat_id: number;
    sender_id: number;
    content: string;
    created_at: string;
  };
}
