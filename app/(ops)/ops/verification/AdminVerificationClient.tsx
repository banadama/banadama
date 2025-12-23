"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export type CompanyDoc = {
  id: string;
  owner_user_id: string;
  company_name: string;
  country: string;
  role: string;
  document_type: string;
  file_path: string;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
};

type Props = {
  initialDocs: CompanyDoc[];
};

export default function AdminVerificationClient({ initialDocs }: Props) {
  const supabase = createSupabaseBrowserClient();
  const [docs, setDocs] = useState<CompanyDoc[]>(initialDocs);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdateStatus(
    doc: CompanyDoc,
    status: "approved" | "rejected"
  ) {
    const note =
      status === "rejected"
        ? window.prompt("Reason for rejection (optional):") ?? ""
        : doc.admin_note ?? "";

    setActionLoadingId(doc.id);
    setError(null);

    const { error: updateError } = await supabase
      .from("company_documents")
      .update({
        status,
        admin_note: note || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", doc.id);

    if (updateError) {
      setError("Failed to update: " + updateError.message);
      setActionLoadingId(null);
      return;
    }

    setDocs((prev) =>
      prev.map((d) =>
        d.id === doc.id
          ? {
              ...d,
              status,
              admin_note: note || null,
              reviewed_at: new Date().toISOString(),
            }
          : d
      )
    );
    setActionLoadingId(null);
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">
        Company Verification (Admin)
      </h1>
      <p className="text-sm text-slate-600 mb-4">
        Review and approve or reject company documents submitted by factories,
        suppliers and creators on Banadama.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <VerificationSections
        docs={docs}
        onUpdateStatus={handleUpdateStatus}
        actionLoadingId={actionLoadingId}
      />
    </main>
  );
}

type SectionsProps = {
  docs: CompanyDoc[];
  onUpdateStatus: (
    doc: CompanyDoc,
    status: "approved" | "rejected"
  ) => Promise<void>;
  actionLoadingId: string | null;
};

function VerificationSections({
  docs,
  onUpdateStatus,
  actionLoadingId,
}: SectionsProps) {
  const pending = docs.filter((d) => d.status === "pending");
  const approved = docs.filter((d) => d.status === "approved");
  const rejected = docs.filter((d) => d.status === "rejected");

  return (
    <div className="space-y-6">
      <Section
        title={`Pending (${pending.length})`}
        docs={pending}
        onUpdateStatus={onUpdateStatus}
        actionLoadingId={actionLoadingId}
      />
      <Section
        title={`Approved (${approved.length})`}
        docs={approved}
        onUpdateStatus={onUpdateStatus}
        actionLoadingId={actionLoadingId}
        readOnly
      />
      <Section
        title={`Rejected (${rejected.length})`}
        docs={rejected}
        onUpdateStatus={onUpdateStatus}
        actionLoadingId={actionLoadingId}
        readOnly
      />
    </div>
  );
}

type SectionProps = {
  title: string;
  docs: CompanyDoc[];
  onUpdateStatus: (
    doc: CompanyDoc,
    status: "approved" | "rejected"
  ) => Promise<void>;
  actionLoadingId: string | null;
  readOnly?: boolean;
};

function Section({
  title,
  docs,
  onUpdateStatus,
  actionLoadingId,
  readOnly,
}: SectionProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      <DocTable
        docs={docs}
        onUpdateStatus={onUpdateStatus}
        actionLoadingId={actionLoadingId}
        readOnly={readOnly}
      />
    </section>
  );
}

type DocTableProps = {
  docs: CompanyDoc[];
  onUpdateStatus: (
    doc: CompanyDoc,
    status: "approved" | "rejected"
  ) => Promise<void>;
  actionLoadingId: string | null;
  readOnly?: boolean;
};

function DocTable({
  docs,
  onUpdateStatus,
  actionLoadingId,
  readOnly,
}: DocTableProps) {
  if (!docs.length) {
    return (
      <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
        No documents in this status.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-xs">
        <thead className="bg-slate-50">
          <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Company</th>
            <th className="px-3 py-2">Role</th>
            <th className="px-3 py-2">Country</th>
            <th className="px-3 py-2">Doc type</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Note</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2">Reviewed</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id} className="border-t">
              <td className="px-3 py-2">
                <div className="font-semibold text-[11px]">
                  {doc.company_name}
                </div>
                <div className="text-[10px] text-slate-500">
                  User: {doc.owner_user_id.slice(0, 8)}…
                </div>
              </td>
              <td className="px-3 py-2 text-[11px] uppercase">
                {doc.role}
              </td>
              <td className="px-3 py-2 text-[11px]">{doc.country}</td>
              <td className="px-3 py-2 text-[11px]">
                {formatDocTypeLabel(doc.document_type)}
              </td>
              <td className="px-3 py-2">
                <span
                  className={
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium " +
                    (doc.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : doc.status === "rejected"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700")
                  }
                >
                  {doc.status}
                </span>
              </td>
              <td className="px-3 py-2">
                <span className="text-[10px] text-slate-600">
                  {doc.admin_note || "-"}
                </span>
              </td>
              <td className="px-3 py-2 text-[10px] text-slate-500">
                {new Date(doc.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-[10px] text-slate-500">
                {doc.reviewed_at
                  ? new Date(doc.reviewed_at).toLocaleString()
                  : "-"}
              </td>
              <td className="px-3 py-2">
                {readOnly ? (
                  <span className="text-[10px] text-slate-400">-</span>
                ) : (
                  <div className="flex gap-1">
                    <button
                      disabled={actionLoadingId === doc.id}
                      onClick={() => onUpdateStatus(doc, "approved")}
                      className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] disabled:opacity-60"
                    >
                      {actionLoadingId === doc.id ? "Saving…" : "Approve"}
                    </button>
                    <button
                      disabled={actionLoadingId === doc.id}
                      onClick={() => onUpdateStatus(doc, "rejected")}
                      className="px-2 py-1 rounded-lg bg-red-600 text-white text-[10px] disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDocTypeLabel(type: string) {
  switch (type) {
    case "cac_certificate":
      return "CAC Certificate";
    case "trade_license":
      return "Trade License";
    case "vat_bin":
      return "VAT / BIN";
    case "director_id":
      return "Director ID";
    case "passport":
      return "Passport";
    case "bank_proof":
      return "Bank Proof";
    default:
      return type;
  }
}
