import React, { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function CustomTooltip({ active, payload, label }: any) {
  console.log('TOOLTIP', active, payload, label);
  if (active && payload && payload.length) {
    // try both value positions
    const raw = payload[0];
    const val = raw.payload?.balance ?? raw.value;
    const isInitial = label === 0;
    return (
      <div className="bg-white p-2 rounded shadow text-black">
        <p className="text-sm font-semibold">
          {isInitial ? "Initial Savings" : `Month ${label}`}
        </p>
        <p className="text-sm">${val}</p>
      </div>
    );
  }
  return null;
}

export default function Calculator() {
  const [leaseTermInput, setLeaseTermInput] = useState("");
  const [baseRentInput, setBaseRentInput] = useState("");
  const [page, setPage] = useState<1 | 2 | 3>(1);
  const [freeMonths, setFreeMonths] = useState<number[]>([]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [viewFreeMonths, setViewFreeMonths] = useState(true);
  const leaseTermRef = useRef<HTMLInputElement>(null);

  const leaseTerm = parseInt(leaseTermInput, 10);
  const baseRent = parseFloat(baseRentInput);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && page === 1 && leaseTerm && baseRent) {
        setPage(2);
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => document.removeEventListener("keydown", handleEnter);
  }, [leaseTerm, baseRent, page]);

  // steady monthly target P
  const steadyRent = useMemo(() => {
    if (!leaseTerm || !baseRent) return 0;
    const paidMonths = leaseTerm - freeMonths.length;
    return paidMonths > 0
      ? Math.round((baseRent * paidMonths) / leaseTerm)
      : 0;
  }, [leaseTerm, baseRent, freeMonths]);

  // build plan with deltas and running balance
  const { plan: budgetPlan, seed } = useMemo(() => {
    if (!leaseTerm || !baseRent) return { plan: [], seed: 0 };

    // compute deltas
    const deltas = Array.from({ length: leaseTerm }, (_, i) => {
      const m = i + 1;
      const isFree = freeMonths.includes(m);
      const delta = isFree ? steadyRent : -(baseRent - steadyRent);
      return { month: m, isFree, delta };
    });

    // running balance and find min
    let balance = 0;
    let minBalance = 0;
    const plan = deltas.map(d => {
      balance += d.delta;
      minBalance = Math.min(minBalance, balance);
      return { ...d, balance };
    });

    // initial seed needed
    const seed = minBalance < 0 ? -minBalance : 0;
    if (seed > 0) {
      // add month 0 entry
      plan.unshift({ month: 0, isFree: false, delta: seed, balance: seed });
    }
    return { plan, seed };

  }, [leaseTerm, baseRent, freeMonths, steadyRent]);

  const resetCalculator = () => {
    setLeaseTermInput("");
    setBaseRentInput("");
    setFreeMonths([]);
    setPage(1);
    setShowBreakdown(false);
    setViewFreeMonths(true);
  };

  const handleToggleMonth = (month: number) => {
    setFreeMonths(prev =>
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  };

  return (
    <main className="bg-[#1A1A1A] text-white min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#B69D74]">
          Proration Budgeting Calculator
        </h1>

        {/* Page 1 & 2 omitted for brevity, unchanged */}
        {page === 1 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-300 space-y-2">
              <div>
                <strong>Who is this for?</strong> If you can afford the monthly prorated rent but not the full base rent every month, this tool helps you spread your rent evenly across your lease.
              </div>
              <div>
                <strong>How it works:</strong> During free months, you'll save the steady amount. During paid months, you'll draw from savings so your monthly cash flow feels consistent.
              </div>
            </div>
            <div>
              <label className="block mb-1">Base Monthly Rent ($):</label>
              <input
                type="text"
                value={baseRentInput}
                onChange={e => setBaseRentInput(e.target.value)}
                placeholder="e.g. 2350"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Lease Term (months):</label>
              <input
                ref={leaseTermRef}
                type="text"
                value={leaseTermInput}
                onChange={e => setLeaseTermInput(e.target.value)}
                placeholder="e.g. 14"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>
            <button
              onClick={() => leaseTerm && baseRent && setPage(2)}
              className="w-full mt-4 px-4 py-2 bg-[#B69D74] text-white rounded"
            >
              Next
            </button>
          </div>
        )}

        {page === 2 && (
          <div className="space-y-4">
            <p className="text-center">Select which months are free within your lease:</p>
            <div className="grid grid-cols-4 gap-2 justify-center">
              {Array.from({ length: leaseTerm }, (_, i) => i + 1).map(month => (
                <button
                  key={month}
                  onClick={() => handleToggleMonth(month)}
                  className={cn(
                    "px-3 py-2 rounded text-sm font-medium",
                    freeMonths.includes(month)
                      ? "bg-[#B69D74] text-white"
                      : "bg-gray-700 text-gray-300"
                  )}
                >
                  {month}
                </button>
              ))}
            </div>
            <div className="text-center pt-2 text-sm">
              Steady Monthly Target: <strong>${steadyRent}</strong>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(1)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded"
              >
                Back
              </button>
              <button
                onClick={() => setPage(3)}
                disabled={freeMonths.length === 0}
                className={cn(
                  "w-full px-4 py-2 rounded",
                  freeMonths.length > 0
                    ? "bg-[#B69D74] text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                )}
              >
                View Budget Plan
              </button>
            </div>
          </div>
        )}

        {page === 3 && (
          <div className="space-y-4">
            {/* Summary Box */}
            <div className="bg-[#2F2F2F] border border-[#B69D74] p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-[#B69D74]">
                Steady Monthly Target: ${steadyRent}
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Use this breakdown to budget: save during free months, draw during paid months.
              </p>
            </div>

            {/* Chart */}
            <div className="bg-[#2F2F2F] p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={budgetPlan.map(item => ({ month: item.month, balance: item.balance }))} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="balance" stroke="#B69D74" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Toggleable Bar with initial seed callout */}
            {leaseTerm && (
              <div
                onClick={() => setViewFreeMonths(prev => !prev)}
                className="bg-[#2F2F2F] border border-[#B69D74] p-4 rounded-lg space-y-2 cursor-pointer"
              >
                {/* Initial savings callout */}
                {seed > 0 && (
                  <div className="text-sm font-bold text-[#FFD700] text-center">
                    Initial savings required: ${seed}
                  </div>
                )}
               <p className="text-xs text-center text-gray-400">
                  Click to change view
                </p>

                <div className="relative w-full h-6 bg-gray-700 rounded-full overflow-hidden">
                  {Array.from({ length: leaseTerm }, (_, i) => {
                    const month = i + 1;
                    const isFree = freeMonths.includes(month);
                    const show = (viewFreeMonths && isFree) || (!viewFreeMonths && !isFree);
                    return (
                      <div
                        key={month}
                        title={`Month ${month}: ${isFree ? "Free" : "Paid"}`}
                        className={`h-full float-left text-[10px] text-center leading-6 font-semibold ${
                          isFree && viewFreeMonths
                            ? "bg-green-600 text-white"
                            : !isFree && !viewFreeMonths
                            ? "bg-gray-500 text-black"
                            : "bg-gray-800 text-gray-600"
                        }`}
                        style={{ width: `${100 / leaseTerm}%`, opacity: show ? 1 : 0.4 }}
                      >
                        {month}
                      </div>
                    );
                  })}
                </div>
                <div className="text-center text-sm font-semibold mt-2">
                  {viewFreeMonths ? (
                    <span className="text-green-400">Rent Due: $0</span>
                  ) : (
                    <span className="text-white">Rent Due: ${baseRent}</span>
                  )}
                </div>
              </div>
            )}

            {/* Breakdown Button */}
            <button
              onClick={() => setShowBreakdown(prev => !prev)}
              className="w-full px-4 py-2 bg-[#B69D74] text-white font-semibold rounded"
            >
              {showBreakdown ? "Hide" : "Show"} Monthly Budget Breakdown
            </button>

            {/* Monthly Budget Breakdown without month 0 */}
            {showBreakdown && (
              <div className="grid grid-cols-5 gap-2 text-sm text-center">
                <div className="font-bold">Month</div>
                <div className="font-bold">Rent Due</div>
                <div className="font-bold">Steady Target</div>
                <div className="font-bold">Save/Use</div>
                <div className="font-bold">Reserve</div>
                {budgetPlan
                  .filter(item => item.month > 0)
                  .map(item => (
                    <React.Fragment key={item.month}>
                      <div>{item.month}</div>
                      <div>${item.isFree ? 0 : baseRent}</div>
                      <div>${steadyRent}</div>
                      <div className={item.delta > 0 ? "text-green-400" : "text-red-400"}>
                        {item.delta > 0 ? `+${item.delta}` : `${item.delta}`}
                      </div>
                      <div>${item.balance}</div>
                    </React.Fragment>
                  ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setPage(2)}
                className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded"
              >
                Back
              </button>
              <button
                onClick={resetCalculator}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Reset Calculator
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
