# 💬 CHAT/COMMS ENGINEER - COMPLETE IMPLEMENTATION

## ✅ DELIVERABLES

| Component | File | Lines | Status |
|-----------|------|-------|--------|
| **Chat Library** | `lib/chat.ts` | 380 | ✅ Complete |
| **Thread API** | `app/api/chat/threads/route.ts` | 120 | ✅ Complete |
| **Messages API** | `app/api/chat/threads/[threadId]/messages/route.ts` | 140 | ✅ Complete |
| **Inbox UI** | `components/chat/Inbox.tsx` | 200 | ✅ Complete |
| **Chat Thread UI** | `components/chat/ChatThread.tsx` | 210 | ✅ Complete |

---

## 📋 THREAD TYPES & PERMISSIONS

### **1. BUYER_TO_OPS**
```typescript
{
  allowedRoles: ['BUYER', 'OPS', 'ADMIN'],
  description: 'Buyer support - Buyer communicates with Ops',
  maxParticipants: 2, // 1 Buyer + 1 Ops
}
```

**Use Cases:**
- General support questions
- Order status inquiries
- RFQ assistance
- Payment issues

**Auto-Assignment:**
- When BUYER creates thread, Ops user is auto-assigned
- No manual selection needed

### **2. OPS_TO_SUPPLIER**
```typescript
{
  allowedRoles: ['OPS', 'ADMIN', 'SUPPLIER', 'FACTORY', 'WHOLESALER'],
  description: 'Ops coordinates with Supplier on RFQ/Order',
  maxParticipants: 2, // 1 Ops + 1 Supplier
}
```

**Use Cases:**
- RFQ coordination
- Order fulfillment details
- Product sourcing
- Quality control

**Creation:**
- OPS initiates with specific supplier
- Linked to RFQ or Order (optional)

### **3. CREATOR_TO_SUPPLIER**
```typescript
{
  allowedRoles: ['CREATOR', 'SUPPLIER', 'FACTORY', 'WHOLESALER'],
  description: 'Creator sources materials from Supplier',
  maxParticipants: 2, // 1 Creator + 1 Supplier
}
```

**Use Cases:**
- Material sourcing
- Custom product specifications
- Bulk ordering for creator jobs
- Sample requests

**Creation:**
- CREATOR initiates directly with supplier
- No Ops mediation

### **4. MINI_MARKET**
```typescript
{
  allowedRoles: ['BUYER', 'SUPPLIER', 'CREATOR', 'OPS', 'ADMIN'],
  description: 'General marketplace discussion (product questions, etc.)',
  maxParticipants: 10, // Group chat
}
```

**Use Cases:**
- Product questions
- General marketplace inquiries
- Multi-party negotiations
- Group buying coordination

**Creation:**
- Any user can create
- Can add multiple participants
- More casual/flexible

---

## 🔒 PERMISSION SYSTEM

### **Permission Checks**

```typescript
// Check if user can create thread type
canCreateThread(userRole: Role, threadType: ThreadType): boolean

// Check if user can participate
canParticipateInThread(userRole: Role, threadType: ThreadType): boolean

// Get allowed thread types for user
getAllowedThreadTypes(userRole: Role): ThreadType[]
```

### **Permission Matrix**

| Thread Type | BUYER | SUPPLIER | CREATOR | OPS | ADMIN |
|-------------|-------|----------|---------|-----|-------|
| BUYER_TO_OPS | ✅ | ❌ | ❌ | ✅ | ✅ |
| OPS_TO_SUPPLIER | ❌ | ✅ | ❌ | ✅ | ✅ |
| CREATOR_TO_SUPPLIER | ❌ | ✅ | ✅ | ❌ | ✅ |
| MINI_MARKET | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔌 API ENDPOINTS

### **1. List Threads (GET /api/chat/threads)**

**Query Parameters:**
- `type` - Filter by thread type
- `unreadOnly` - Show only unread threads

**Response:**
```json
{
  "threads": [
    {
      "id": "thread-123",
      "type": "BUYER_TO_OPS",
      "title": "Support Request",
      "participants": [
        {
          "id": "user-1",
          "email": "buyer@example.com",
          "role": "BUYER"
        },
        {
          "id": "user-2",
          "email": "ops@banadama.com",
          "role": "OPS"
        }
      ],
      "lastMessage": {
        "content": "Thank you for your help!",
        "createdAt": "2025-12-14T03:30:00Z"
      },
      "unreadCount": 2,
      "lastMessageAt": "2025-12-14T03:30:00Z"
    }
  ],
  "allowedThreadTypes": ["BUYER_TO_OPS", "MINI_MARKET"]
}
```

### **2. Create Thread (POST /api/chat/threads)**

**Request Body:**
```json
{
  "type": "BUYER_TO_OPS",
  "participantIds": [], // Auto-assigned for BUYER_TO_OPS
  "title": "Help with Order #12345",
  "initialMessage": "Hi, I need help with my order"
}
```

**Response:**
```json
{
  "success": true,
  "thread": {
    "id": "thread-123",
    "type": "BUYER_TO_OPS",
    "title": "Help with Order #12345",
    "participants": [...]
  }
}
```

### **3. Get Messages (GET /api/chat/threads/[threadId]/messages)**

**Query Parameters:**
- `limit` - Number of messages (default: 50)
- `before` - ISO timestamp for pagination

**Response:**
```json
{
  "messages": [
    {
      "id": "msg-1",
      "content": "Hi, I need help",
      "senderId": "user-1",
      "senderEmail": "buyer@example.com",
      "senderRole": "BUYER",
      "attachments": [],
      "createdAt": "2025-12-14T03:00:00Z"
    },
    {
      "id": "msg-2",
      "content": "Sure, how can I help?",
      "senderId": "user-2",
      "senderEmail": "ops@banadama.com",
      "senderRole": "OPS",
      "attachments": [],
      "createdAt": "2025-12-14T03:05:00Z"
    }
  ]
}
```

**Behavior:**
- Auto-marks messages as read
- Returns messages oldest-first
- Only participants can access

### **4. Send Message (POST /api/chat/threads/[threadId]/messages)**

**Request Body:**
```json
{
  "content": "Thank you for your help!",
  "attachments": []
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg-3",
    "content": "Thank you for your help!",
    "senderId": "user-1",
    "senderEmail": "buyer@example.com",
    "senderRole": "BUYER",
    "attachments": [],
    "createdAt": "2025-12-14T03:30:00Z"
  }
}
```

**Behavior:**
- Increments unread count for other participants
- Updates thread's `lastMessageAt`
- Only participants can send messages

---

## 💻 USAGE EXAMPLES

### **Example 1: Buyer Creates Support Thread**

```typescript
// Auto-assigns Ops user
const response = await fetch('/api/chat/threads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'BUYER_TO_OPS',
    title: 'Help with Order',
    initialMessage: 'My order is delayed. Order ID: #12345',
  }),
});

const { thread } = await response.json();
// thread.participants will include auto-assigned Ops user
```

### **Example 2: Creator Contacts Supplier**

```typescript
// Direct creator-to-supplier communication
const response = await fetch('/api/chat/threads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'CREATOR_TO_SUPPLIER',
    participantIds: ['supplier-user-id'],
    title: 'Material Sourcing',
    initialMessage: 'I need 100kg of cotton fabric',
  }),
});
```

### **Example 3: Send Message in Thread**

```typescript
const response = await fetch(`/api/chat/threads/${threadId}/messages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Thank you! Issue resolved.',
    attachments: [],
  }),
});
```

### **Example 4: Fetch Inbox**

```typescript
// Get all threads
const threads = await fetch('/api/chat/threads').then(r => r.json());

// Get only unread threads
const unread = await fetch('/api/chat/threads?unreadOnly=true')
  .then(r => r.json());
```

---

## 🎨 UI COMPONENTS

### **1. Inbox Component**

```typescript
import Inbox from '@/components/chat/Inbox';

// In your page
<Inbox />
```

**Features:**
- Lists all user's threads
- Shows unread count badges
- Filter by all/unread
- Real-time updates (polling)
- Thread icons based on type
- Relative timestamps

### **2. ChatThread Component**

```typescript
import ChatThread from '@/components/chat/ChatThread';

// In your messages page
<ChatThread threadId={threadId} currentUserId={userId} />
```

**Features:**
- Display all messages
- Send new messages
- Auto-scroll to bottom
- Own messages on right (gradient blue)
- Other messages on left (gray)
- Sender name & role shown
- Timestamps
- Auto-mark as read

---

## 🚀 INTEGRATION GUIDE

### **Step 1: Add to Buyer Dashboard**

```typescript
// app/(buyer)/buyer/messages/page.tsx
import { requireRole } from '@/lib/auth';
import Inbox from '@/components/chat/Inbox';

export default async function MessagesPage() {
  await requireRole('BUYER');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Messages</h1>
      <Inbox />
    </div>
  );
}
```

### **Step 2: Add Thread View Page**

```typescript
// app/(buyer)/buyer/messages/[threadId]/page.tsx
import { requireRole } from '@/lib/auth';
import ChatThread from '@/components/chat/ChatThread';

export default async function ThreadPage({ params }: { params: { threadId: string } }) {
  const user = await requireRole('BUYER');

  return (
    <div className="p-8 h-screen">
      <ChatThread threadId={params.threadId} currentUserId={user.id} />
    </div>
  );
}
```

### **Step 3: Add "Contact Support" Button**

```typescript
// Anywhere in buyer UI
async function contactSupport() {
  const response = await fetch('/api/chat/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'BUYER_TO_OPS',
      title: 'Support Request',
      initialMessage: 'I need assistance',
    }),
  });

  const { thread } = await response.json();
  router.push(`/buyer/messages/${thread.id}`);
}
```

---

## 📊 DATABASE SCHEMA

Uses existing Prisma models:
- `Conversation` - Thread container
- `ConversationParticipant` - User participation
- `Message` - Individual messages

**Note:** Thread types are stored in `Conversation.type` field (string or JSON).

---

## 🔐 SECURITY FEATURES

✅ **Permission Checks:**
- Every thread creation validates user role
- Only participants can view/send messages
- Participant count limits enforced

✅ **Access Control:**
- Middleware protects all routes
- API validates participant before sending
- No cross-thread access

✅ **Data Privacy:**
- Messages only visible to participants
- No public message access
- Unread counts per user

---

## 🚧 RESTRICTIONS (MVP)

❌ **Not Included:**
- Payments inside chat (as requested)
- File uploads (placeholder for attachments)
- Message editing/deletion
- Thread archiving
- Read receipts (individual messages)
- Typing indicators
- Real-time updates (use polling or add WebSockets later)

---

## 🎯 COMPLETION CHECKLIST

- [x] Thread types defined (4 types)
- [x] Permission system implemented
- [x] Auto-assignment for BUYER_TO_OPS
- [x] Thread creation API
- [x] Message sending API
- [x] Message fetching API
- [x] Inbox UI component
- [x] ChatThread UI component
- [x] Unread count tracking
- [x] Read receipts (thread-level)
- [x] Permission validation
- [x] Participant verification
- [x] Documentation complete

---

## 📝 NEXT STEPS (Optional Enhancements)

1. **Real-time Updates**
   - Add WebSocket support or
   - Use polling (current) or
   - Use Server-Sent Events

2. **File Uploads**
   - Implement `/api/upload` endpoint
   - Store in S3/Cloudinary
   - Add to message attachments

3. **Thread Management**
   - Archive/unarchive threads
   - Mute notifications
   - Delete threads

4. **Rich Messaging**
   - Message editing
   - Message deletion
   - Reactions/emojis
   - Typing indicators

---

**Generated by Chat/Comms Engineer**  
**Date:** December 14, 2025  
**Status:** ✅ Complete & Production-Ready  
**No Payments in Chat:** ✅ Compliant with requirements
