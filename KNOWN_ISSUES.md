# KNOWN ISSUES - Frontend Foundation

## Build Error (Pre-Existing)

### Issue
```
Error: You cannot use different slug names for the same dynamic path ('conversationId' !== 'threadId').
```

### Root Cause
In the `app/api/messages` folder, there are conflicting dynamic route segments:
- `app/api/messages/[conversationId]/route.ts`
- `app/api/messages/[threadId]/route.ts`

Next.js does not allow different dynamic parameter names at the same level.

### Impact
- **Build fails** (production build cannot complete)
- **Development mode still works** (npm run dev)
- **Foundation code is NOT affected** (this is a backend API routing issue)

### Resolution Required
Choose one of the following:

#### Option 1: Use consistent naming
Rename either all `conversationId` to `threadId` or vice versa.

```bash
# Example: Rename [conversationId] to [threadId]
mv app/api/messages/[conversationId] app/api/messages/[threadId]
```

#### Option 2: Use nested routes
Separate the routes into different parent paths:
```
app/api/messages/conversations/[conversationId]/route.ts
app/api/messages/threads/[threadId]/route.ts
```

#### Option 3: Merge functionality
If both routes serve similar purposes, merge them into a single route with one parameter name.

### Recommendation
**Option 1** is the simplest. Since the codebase already has:
- `app/api/messages/conversations/route.ts`
- `app/api/messages/[threadId]/route.ts`

I recommend:
1. Delete or rename `app/api/messages/[conversationId]` to `[threadId]`
2. Update all frontend references from `conversationId` to `threadId` (or vice versa)
3. Ensure backend logic handles the unified naming

### Status
- ⚠️ **BLOCKING PRODUCTION BUILD**
- ✅ **DOES NOT BLOCK FOUNDATION WORK**
- 📋 **REQUIRES BACKEND CLEANUP** (outside Agent A scope)

### Files to Check
```
app/api/messages/[conversationId]/
app/api/messages/[threadId]/
app/api/messages/conversations/
```

---

## Other Pre-Existing Issues

### Password Verification Placeholder
**File:** `app/api/auth/login/route.ts`  
**Line:** 48

```typescript
const isValid = true; // REPLACE WITH ACTUAL PASSWORD CHECK
```

**Impact:** Login API accepts any password (security risk)

**Resolution:** Implement bcrypt password verification:
```typescript
const isValid = await bcrypt.compare(password, user.passwordHash);
```

**Note:** The database schema needs to have a `passwordHash` field on the `user` table.

---

## Frontend Foundation Status

Despite the build error, **all foundation deliverables are complete and functional**:

✅ API Client (`lib/api.ts`)  
✅ Layout Components (TopNav, SideNav, DashboardShell, RoleRedirect)  
✅ Auth Pages (Login, Register, Forbidden)  
✅ All 7 Role Layouts with RBAC  
✅ Role-based Redirects  
✅ Current User Endpoints  

The build error is a **backend routing conflict** and does not affect the frontend foundation implementation.

---

**Next Steps:**
1. Fix dynamic route naming conflict in `app/api/messages`
2. Add password verification to login API
3. Run `npm run build` to verify production build
4. Proceed with Agent B/C implementation

---

**Last Updated:** 2025-12-14
