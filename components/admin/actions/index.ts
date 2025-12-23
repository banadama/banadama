// components/admin/actions/index.ts - Single Export Point for All Admin Actions
export { useAdminAction } from "@/components/admin/useAdminAction";

// Verifications / Ticks
export { VerificationTickSetter } from "@/components/admin/actions/verifications/VerificationTickSetter";

// Catalog
export { CategoryEditor } from "@/components/admin/actions/catalog/CategoryEditor";
export { LocationEditor } from "@/components/admin/actions/catalog/LocationEditor";

// Feature Flags / Market / Trade
export { FeatureFlagEditor } from "@/components/admin/actions/control/FeatureFlagEditor";
export { MarketControlEditor } from "@/components/admin/actions/control/MarketControlEditor";
export { TradeControlEditor } from "@/components/admin/actions/control/TradeControlEditor";

// Users / Accounts
export { UserRoleChanger } from "@/components/admin/actions/users/UserRoleChanger";
export { AccountTypeEditor } from "@/components/admin/actions/users/AccountTypeEditor";

// Finance (FINANCE_ADMIN only)
export { PayoutReleaseButton } from "@/components/admin/actions/finance/PayoutReleaseButton";
export { RefundButton } from "@/components/admin/actions/finance/RefundButton";
