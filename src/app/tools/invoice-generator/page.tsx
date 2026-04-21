"use client";

import { useState, useRef } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("invoice-generator")!;

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function InvoiceGeneratorPage() {
  const [from, setFrom] = useState({ name: "", email: "", address: "" });
  const [to, setTo] = useState({ name: "", email: "", address: "" });
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, price: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("$");
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => `${currency}${amount.toFixed(2)}`;

  const handlePrint = () => {
    setShowPreview(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const inputClass = "w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <ToolPageLayout tool={tool}>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-preview, #invoice-preview * { visibility: visible; }
          #invoice-preview { position: absolute; left: 0; top: 0; width: 100%; padding: 40px; }
          header, footer, nav { display: none !important; }
        }
      `}</style>

      <div className="space-y-6">
        {/* Editor */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            {/* From */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">From</h3>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Your Name / Company</label>
                  <input type="text" value={from.name} onChange={(e) => setFrom({ ...from, name: e.target.value })} placeholder="Your Business Name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={from.email} onChange={(e) => setFrom({ ...from, email: e.target.value })} placeholder="you@example.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <textarea value={from.address} onChange={(e) => setFrom({ ...from, address: e.target.value })} placeholder="Street, City, Country" rows={2} className={inputClass + " resize-none"} />
                </div>
              </div>
            </div>

            {/* To */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill To</h3>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Client Name / Company</label>
                  <input type="text" value={to.name} onChange={(e) => setTo({ ...to, name: e.target.value })} placeholder="Client Name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={to.email} onChange={(e) => setTo({ ...to, email: e.target.value })} placeholder="client@example.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <textarea value={to.address} onChange={(e) => setTo({ ...to, address: e.target.value })} placeholder="Street, City, Country" rows={2} className={inputClass + " resize-none"} />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid gap-4 sm:grid-cols-4 mt-6">
            <div>
              <label className={labelClass}>Invoice Number</label>
              <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Invoice Date</label>
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="¥">JPY (¥)</option>
                <option value="₹">INR (₹)</option>
                <option value="Le ">SLL (Le)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Items</h3>

          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-3 mb-2 px-1">
            <span className="col-span-5 text-xs font-medium text-gray-500">Description</span>
            <span className="col-span-2 text-xs font-medium text-gray-500">Quantity</span>
            <span className="col-span-2 text-xs font-medium text-gray-500">Price</span>
            <span className="col-span-2 text-xs font-medium text-gray-500 text-right">Total</span>
            <span className="col-span-1" />
          </div>

          {/* Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center rounded-xl border border-gray-200 p-3 sm:border-0 sm:p-0">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Item description"
                  className={`${inputClass} sm:col-span-5`}
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  min={1}
                  className={`${inputClass} sm:col-span-2`}
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className={`${inputClass} sm:col-span-2`}
                />
                <p className="sm:col-span-2 text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(item.quantity * item.price)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="sm:col-span-1 p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-20 justify-self-end"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button onClick={addItem} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Item
          </button>

          {/* Totals */}
          <div className="mt-6 border-t border-gray-200 pt-4 space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm gap-3">
              <span className="text-gray-500">Tax</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm text-center outline-none focus:border-blue-400"
                />
                <span className="text-gray-500">%</span>
              </div>
              <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-blue-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Notes / Payment Instructions</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, bank details, thank you message..."
            rows={3}
            className={inputClass + " resize-none"}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handlePrint} className="btn-primary flex-1 py-4 text-base">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
            </svg>
            Print / Save as PDF
          </button>
          <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary py-4 px-6">
            {showPreview ? "Hide" : "Preview"}
          </button>
        </div>

        {/* Print Preview */}
        {showPreview && (
          <div id="invoice-preview" ref={printRef} className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 shadow-sm">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
                <p className="text-sm text-gray-500 mt-1">{invoiceNumber}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p><span className="text-gray-400">Date:</span> {invoiceDate}</p>
                {dueDate && <p><span className="text-gray-400">Due:</span> {dueDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">From</p>
                <p className="font-semibold text-gray-900">{from.name || "Your Name"}</p>
                {from.email && <p className="text-sm text-gray-600">{from.email}</p>}
                {from.address && <p className="text-sm text-gray-600 whitespace-pre-line">{from.address}</p>}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                <p className="font-semibold text-gray-900">{to.name || "Client Name"}</p>
                {to.email && <p className="text-sm text-gray-600">{to.email}</p>}
                {to.address && <p className="text-sm text-gray-600 whitespace-pre-line">{to.address}</p>}
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase">Qty</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-800">{item.description || "—"}</td>
                    <td className="py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                    <td className="py-3 text-sm text-gray-600 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax ({taxRate}%)</span>
                    <span className="text-gray-900">{formatCurrency(tax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t-2 border-gray-900 pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {notes && (
              <div className="mt-10 border-t border-gray-200 pt-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{notes}</p>
              </div>
            )}

            <div className="mt-10 text-center text-xs text-gray-400">
              Generated with ToolsePulse.com — Free Online Tools
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
