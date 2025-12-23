# 🔌 API ROUTES - FILE TREE

```
app/api/
├── auth/
│   ├── register/
│   │   └── route.ts          ✅ User registration
│   ├── login/
│   │   └── route.ts          ✅ User login
│   └── logout/
│       └── route.ts          ✅ User logout
│
├── marketplace/
│   └── products/
│       └── route.ts          ✅ List products (public)
│
├── requests/                  (RFQ System)
│   ├── route.ts              ✅ Create RFQ (BUYER) / List RFQs (role-based)
│   ├── [id]/
│   │   ├── route.ts          ✅ Get RFQ detail
│   │   ├── assign-supplier/
│   │   │   └── route.ts      ✅ Assign supplier (OPS)
│   │   ├── quote/
│   │   │   └── route.ts      ✅ Generate quote (OPS)
│   │   └── confirm/
│   │       └── route.ts      ✅ Accept/Reject quote (BUYER)
│
├── orders/
│   ├── route.ts              ✅ Create order / List orders
│   └── [id]/
│       ├── route.ts          ✅ Get order detail
│       ├── status/
│       │   └── route.ts      ✅ Update order status
│       └── confirm-delivery/
│           └── route.ts      ✅ Confirm delivery (BUYER)
│
├── wallet/
│   ├── route.ts              ✅ Get wallet
│   ├── deposit/
│   │   └── route.ts          ✅ Deposit funds
│   ├── withdraw/
│   │   └── route.ts          ✅ Request withdrawal
│   └── transactions/
│       └── route.ts          ✅ Get transactions
│
└── messages/
    ├── conversations/
    │   └── route.ts          ✅ List conversations
    ├── [conversationId]/
    │   ├── route.ts          ✅ Get conversation
    │   └── messages/
    │       └── route.ts      ✅ Send message / Get messages
    └── create/
        └── route.ts          ✅ Create conversation (Ops-mediated)
```

**Total: 20+ API endpoints**
