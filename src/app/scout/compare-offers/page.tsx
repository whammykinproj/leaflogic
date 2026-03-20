"use client";

import Link from "next/link";
import { useState } from "react";

interface Offer {
  id: string;
  company: string;
  role: string;
  baseSalary: string;
  bonus: string;
  equity: string;
  benefits: string;
  pto: string;
  remote: string;
  notes: string;
}

function emptyOffer(): Offer {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    baseSalary: "",
    bonus: "",
    equity: "",
    benefits: "",
    pto: "",
    remote: "",
    notes: "",
  };
}

function parseNum(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, "")) || 0;
}

export default function CompareOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([emptyOffer(), emptyOffer()]);

  const updateOffer = (id: string, field: keyof Offer, value: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const addOffer = () => {
    if (offers.length < 4) setOffers([...offers, emptyOffer()]);
  };

  const removeOffer = (id: string) => {
    if (offers.length > 2) setOffers(offers.filter((o) => o.id !== id));
  };

  const totalComp = (o: Offer) =>
    parseNum(o.baseSalary) + parseNum(o.bonus) + parseNum(o.equity);

  const bestTotal = Math.max(...offers.map(totalComp));

  const fields: { key: keyof Offer; label: string; type: "text" | "currency" }[] = [
    { key: "company", label: "Company", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "baseSalary", label: "Base Salary", type: "currency" },
    { key: "bonus", label: "Annual Bonus", type: "currency" },
    { key: "equity", label: "Equity (annual)", type: "currency" },
    { key: "benefits", label: "Benefits", type: "text" },
    { key: "pto", label: "PTO", type: "text" },
    { key: "remote", label: "Remote Policy", type: "text" },
    { key: "notes", label: "Notes", type: "text" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <Link href="/scout/dashboard" className="text-xl font-bold">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <Link
          href="/scout/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          Back to dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Compare Offers</h1>
      <p className="text-zinc-400 mb-8">
        Side-by-side comparison of job offers. See total comp, benefits, and
        make the right decision.
      </p>

      {/* Total comp summary */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `repeat(${offers.length}, 1fr)` }}>
        {offers.map((o) => {
          const tc = totalComp(o);
          const isBest = tc > 0 && tc === bestTotal;
          return (
            <div
              key={o.id}
              className={`bg-zinc-900 border rounded-xl p-4 text-center ${
                isBest
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-zinc-800"
              }`}
            >
              <p className="text-sm text-zinc-500 mb-1">
                {o.company || "Offer"}
              </p>
              <p
                className={`text-2xl font-bold ${
                  isBest ? "text-emerald-400" : "text-white"
                }`}
              >
                {tc > 0 ? `$${tc.toLocaleString()}` : "—"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Total comp</p>
              {isBest && tc > 0 && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">
                  Best offer
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-zinc-500 font-medium w-36">
                  Field
                </th>
                {offers.map((o, i) => (
                  <th
                    key={o.id}
                    className="px-4 py-3 text-left text-zinc-400 font-medium"
                  >
                    <div className="flex items-center justify-between">
                      <span>{o.company || `Offer ${i + 1}`}</span>
                      {offers.length > 2 && (
                        <button
                          onClick={() => removeOffer(o.id)}
                          className="text-zinc-600 hover:text-red-400 transition ml-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.key} className="border-b border-zinc-800/50">
                  <td className="px-4 py-2 text-zinc-500 font-medium">
                    {field.label}
                  </td>
                  {offers.map((o) => {
                    const val = o[field.key];
                    const isHighest =
                      field.type === "currency" &&
                      parseNum(val) > 0 &&
                      parseNum(val) ===
                        Math.max(...offers.map((x) => parseNum(x[field.key])));
                    return (
                      <td key={o.id} className="px-4 py-2">
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            updateOffer(o.id, field.key, e.target.value)
                          }
                          placeholder={
                            field.type === "currency" ? "$0" : "—"
                          }
                          className={`w-full bg-transparent border-b border-zinc-800 focus:border-emerald-500 outline-none py-1 text-sm ${
                            isHighest ? "text-emerald-400 font-medium" : "text-zinc-300"
                          } placeholder:text-zinc-700`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {offers.length < 4 && (
        <button
          onClick={addOffer}
          className="mt-4 text-sm text-zinc-500 hover:text-emerald-400 transition"
        >
          + Add another offer
        </button>
      )}

      <p className="text-xs text-zinc-600 mt-6 text-center">
        Data stays in your browser — nothing is sent to any server.
      </p>
    </div>
  );
}
