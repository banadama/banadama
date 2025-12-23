# BANADAMA OPS DAILY CYCLE & KPI TRACKING

## 📋 LIVE DAILY CYCLE

### A) Morning Ops Check (08:00 - 10:00)

| Task | Route | Action |
|------|-------|--------|
| **RFQ Queue** | `/ops/buyer-requests` | Check for new RFQs, assign suppliers |
| **Pending Quotes** | `/ops/buyer-requests` | Send quotes to buyers pending confirmation |
| **Active Orders** | `/ops/orders` | Review status of all active orders |
| **Escrow Ledger** | Dashboard | Ensure locked vs released balance is correct |

**Checklist:**
- [ ] All new RFQs reviewed
- [ ] Suppliers assigned to pending RFQs
- [ ] Quotes generated and sent
- [ ] Escrow ledger balanced

---

### B) Midday Check (12:00 - 14:00)

| Task | Route | Action |
|------|-------|--------|
| **Delayed Orders** | `/ops/orders?status=DELAYED` | Identify and follow up with suppliers |
| **Buyer Messages** | `/ops/messages` | Respond to Buyer ↔ Ops threads |
| **Supplier Messages** | `/ops/messages` | Respond to Supplier ↔ Ops threads |

**Checklist:**
- [ ] Delayed orders flagged and suppliers contacted
- [ ] All buyer messages responded within 2 hours
- [ ] All supplier messages responded within 2 hours
- [ ] Escalations noted

---

### C) End-of-Day Close (17:00 - 18:00)

| Task | Route | Action |
|------|-------|--------|
| **Completed Deliveries** | `/ops/orders?status=DELIVERED` | Confirm and release payouts |
| **Unresolved Chats** | `/ops/messages` | Tag open threads for next day |
| **Daily Summary** | Generate report | Compile day's metrics |

**Checklist:**
- [ ] All confirmed deliveries → payouts released
- [ ] Open chats tagged for follow-up
- [ ] Daily summary generated
- [ ] Tomorrow's priorities identified

---

## 📊 DAILY KPI TRACKING

### Manual Daily Record Template

| Date: __________ | Morning | Midday | EOD |
|------------------|---------|--------|-----|
| **RFQs Received** | | | |
| **Quotes Sent** | | | |
| **Orders Created** | | | |
| **Orders Shipped** | | | |
| **Orders Delivered** | | | |
| **Payouts Released** | | | |
| **Delayed Orders** | | | |
| **Open Buyer Chats** | | | |
| **Open Supplier Chats** | | | |

---

## 📈 WEEKLY KPI SUMMARY

| Metric | Mon | Tue | Wed | Thu | Fri | Sat | Sun | Total |
|--------|-----|-----|-----|-----|-----|-----|-----|-------|
| RFQs Received | | | | | | | | |
| Quotes Sent | | | | | | | | |
| Quote → Order % | | | | | | | | |
| Paid (Escrow) | | | | | | | | |
| Delivered | | | | | | | | |
| Payouts Released | | | | | | | | |
| Delayed | | | | | | | | |
| Avg Response Time | | | | | | | | |

---

## 🔴 ESCALATION TRIGGERS

| Condition | Action |
|-----------|--------|
| RFQ pending > 24h without supplier | Escalate to Ops Lead |
| Quote pending > 48h without confirmation | Follow up with buyer |
| Order delayed > 3 days | Contact supplier, notify buyer |
| Escrow > 7 days after delivery | Force payout or investigate |
| Unresolved chat > 24h | Priority response |

---

## 🎯 KPI TARGETS

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| RFQ → Quote Time | < 4 hours | < 8 hours | > 24 hours |
| Quote → Order Conversion | > 60% | > 40% | < 30% |
| Order Fulfillment Rate | > 95% | > 85% | < 80% |
| Message Response Time | < 2 hours | < 4 hours | > 8 hours |
| Dispute Rate | < 2% | < 5% | > 10% |
| Payout Release Time | < 24h after delivery | < 48h | > 72h |

---

## 📱 OPS DASHBOARD ROUTES

| Function | Route |
|----------|-------|
| **Main Dashboard** | `/ops/dashboard` |
| **RFQ Queue** | `/ops/buyer-requests` |
| **RFQ Detail** | `/ops/buyer-requests/[id]` |
| **Orders List** | `/ops/orders` |
| **Order Detail** | `/ops/orders/[id]` |
| **Messages** | `/ops/messages` |
| **Verifications** | `/ops/verifications` |
| **RFQ Overview** | `/ops/rfqs` |

---

## 🔄 STATUS FLOW REFERENCE

### RFQ Status Flow
```
PENDING → ASSIGNED → QUOTED → CONFIRMED → [Order Created]
            ↓
        CANCELLED
```

### Order Status Flow
```
PENDING → PROCESSING → SHIPPED → DELIVERED
    ↓         ↓           ↓
CANCELLED  DELAYED    RETURNED
```

### Escrow Flow
```
PAYMENT_RECEIVED → LOCKED → DELIVERY_CONFIRMED → PAYOUT_RELEASED
                      ↓
                  DISPUTED → RESOLVED → PAYOUT_RELEASED
                      ↓
                  REFUNDED
```

---

## 📝 DAILY SUMMARY TEMPLATE

```
=== BANADAMA DAILY SUMMARY ===
Date: [DATE]
Ops: [NAME]

📥 INBOUND
- New RFQs: X
- Buyer Messages: X
- Supplier Messages: X

📤 OUTBOUND  
- Suppliers Assigned: X
- Quotes Sent: X
- Orders Created: X

📦 FULFILLMENT
- Orders Shipped: X
- Orders Delivered: X
- Payouts Released: ₦X,XXX,XXX

⚠️ ISSUES
- Delayed Orders: X
- Open Disputes: X
- Escalations: X

💰 ESCROW STATUS
- Locked: ₦X,XXX,XXX
- Released Today: ₦X,XXX,XXX

🎯 TOMORROW'S PRIORITIES
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]
```

---

**Last Updated:** 2024-12-14
**Version:** 1.0
