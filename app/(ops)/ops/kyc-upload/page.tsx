"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

type Role = "buyer" | "factory" | "supplier" | "creator";
type DocumentType =
  | "cac_certificate"
  | "trade_license"
  | "vat_bin"
  | "director_id"
  | "passport"
  | "bank_proof";

export default function DashboardVerificationPage() {
  const supabase = createSupabaseBrowserClient();

  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [role, setRole] = useState<Role>("factory");
  const [docType, setDocType] = useState<DocumentType>("cac_certificate");
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }
    if (!companyName.trim()) {
      setError("Please enter your company name.");
      return;
    }

    setSubmitting(true);

    // 1) duba user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to submit documents.");
      setSubmitting(false);
      return;
    }

    try {
      // 2) upload zuwa storage bucket (company-docs)
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}-${docType}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("company-docs")
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        setError("Failed to upload file: " + uploadError.message);
        setSubmitting(false);
        return;
      }

      // 3) insert row a company_documents table
      const { error: insertError } = await supabase
        .from("company_documents")
        .insert({
          owner_user_id: user.id,
          company_name: companyName.trim(),
          country,
          role,
          document_type: docType,
          file_path: filePath,
          status: "pending",
          admin_note: null,
        });

      if (insertError) {
        console.error(insertError);
        setError("Failed to save document record: " + insertError.message);
        setSubmitting(false);
        return;
      }

      setMessage(
        "Document submitted successfully. Banadama admin will review and verify your account."
      );
      setCompanyName("");
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError("Unexpected error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">Company Verification</h1>
      <p className="text-sm text-slate-600 mb-4">
        Upload your official company documents for Banadama to verify your
        factory, supplier, or creator account.
      </p>

      {message && (
        <div className="mb-4 rounded-lg bg-emerald-50 text-emerald-700 text-sm px-3 py-2">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1">
            Company name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Banadama Garments Ltd"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">
            Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="Nigeria">Nigeria</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Ghana">Ghana</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">
            Account type (role)
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="factory">Factory / Manufacturer</option>
            <option value="supplier">Supplier / Trader</option>
            <option value="creator">Design Creator</option>
            <option value="buyer">Buyer only</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">
            Document type
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocumentType)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="cac_certificate">CAC / Company Certificate</option>
            <option value="trade_license">Trade license</option>
            <option value="vat_bin">VAT / BIN / TIN</option>
            <option value="director_id">Director ID / NIN</option>
            <option value="passport">Passport</option>
            <option value="bank_proof">Bank statement / proof</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">
            Document file (PDF / Image)
          </label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            We recommend clear scanned copy. Max size: ~10MB.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-lg bg-black text-white text-sm px-4 py-2 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit for verification"}
        </button>
      </form>
    </main>
  );
}
