import React, { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Custom tooltip to show month, reserve, and rent/free info
type TooltipPayload = { dataKey: string; value: number };
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const rentPayload = (payload as TooltipPayload[]).find(p => p.dataKey === 'rentDue');
    const balancePayload = (payload as TooltipPayload[]).find(p => p.dataKey === 'balance');
    return (
      <div className="bg-white p-2 rounded shadow text-black">
        <p className="text-sm font-semibold">Month {label}</p>
        {balancePayload && <p className="text-sm">Reserve: ${balancePayload.value}</p>}
        {rentPayload && (
          <p className="text-sm">
            {rentPayload.value > 0 ? `Rent Due: $${rentPayload.value}` : 'Free Month'}
          </p>
        )}
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
  const [showRentLine, setShowRentLine] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const leaseTermRef = useRef<HTMLInputElement>(null);
  const leaseTerm = parseInt(leaseTermInput, 10);
  const baseRent = parseFloat(baseRentInput);

  // Allow Enter key to go to next page
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && page === 1) setPage(2);
    };
    document.addEventListener('keydown', handleEnter);
    return () => document.removeEventListener('keydown', handleEnter);
  }, [page]);

  // Calculate steady monthly target
  const steadyRent = useMemo(() => {
    if (!leaseTerm || !baseRent) return 0;
    const paidMonths = leaseTerm - freeMonths.length;
    return paidMonths > 0 ? Math.round((baseRent * paidMonths) / leaseTerm) : 0;
  }, [leaseTerm, baseRent, freeMonths]);

  // Build budget plan + seed
  const { plan: budgetPlan, seed } = useMemo(() => {
    if (!leaseTerm || !baseRent) return { plan: [], seed: 0 };
    const deltas = Array.from({ length: leaseTerm }, (_, i) => {
      const m = i + 1;
      const isFree = freeMonths.includes(m);
      const delta = isFree ? steadyRent : -(baseRent - steadyRent);
      return { month: m, isFree, delta };
    });

    let running = 0;
    let minRunning = 0;
    deltas.forEach(d => {
      running += d.delta;
      minRunning = Math.min(minRunning, running);
    });
    const seed = minRunning < 0 ? -minRunning : 0;

    const plan: any[] = [];
    if (seed > 0) plan.push({ month: 0, isFree: false, delta: seed, balance: seed });
    let balance = seed;
    deltas.forEach(d => {
      balance += d.delta;
      plan.push({ month: d.month, isFree: d.isFree, delta: d.delta, balance });
    });

    return { plan, seed };
  }, [leaseTerm, baseRent, freeMonths, steadyRent]);

  const chartData = useMemo(
    () =>
      budgetPlan
        .filter(item => item.month > 0)
        .map(item => ({
          month: item.month,
          balance: item.balance,
          rentDue: item.isFree ? 0 : baseRent,
          target: steadyRent,
          delta: item.delta,
        })),
    [budgetPlan, baseRent, steadyRent]
  );

  const resetCalculator = () => {
    setLeaseTermInput("");
    setBaseRentInput("");
    setFreeMonths([]);
    setPage(1);
    setShowBreakdown(false);
    setShowRentLine(false);
    setEditOpen(false);
  };

  const handleToggleMonth = (month: number) => {
    setFreeMonths(prev => (prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]));
  };

  return (
    <main className="bg-[#1A1A1A] text-white min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#B69D74]">
          Proration Budgeting Calculator
        </h1>

        {/* Page 1: Introduction */}
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
            <button onClick={() => setPage(2)} className="w-full mt-4 px-4 py-2 bg-[#B69D74] text-white rounded">
              Start
            </button>
          </div>
        )}

        {/* Page 2: Inputs + Free Months */}
        {page === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
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
            </div>

            <p className="text-center text-sm text-gray-300">
              {leaseTerm > 0 && baseRent > 0
                ? "Select which months are free within your lease:"
                : "Enter Base Rent & Lease Term"}
            </p>

            {leaseTerm > 0 && baseRent > 0 && (
              <div className="grid grid-cols-4 gap-2 justify-center">
                {Array.from({ length: leaseTerm }, (_, i) => i + 1).map(month => (
                  <button
                    key={month}
                    onClick={() => handleToggleMonth(month)}
                    className={cn(
                      "px-3 py-2 rounded text-sm font-medium",
                      freeMonths.includes(month) ? "bg-[#B69D74] text-white" : "bg-gray-700 text-gray-300"
                    )}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            <div className="text-center pt-2 text-sm">
              Steady Monthly Target: <strong>${steadyRent}</strong>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPage(1)} className="w-full px-4 py-2 bg-gray-600 text-white rounded">
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
  <div className="space-y-6">
    {/* Summary Box */}
    <div className="bg-[#2F2F2F] border border-[#B69D74] p-4 rounded-lg text-center">
      <h3 className="text-lg font-semibold text-[#B69D74]">
        Steady Monthly Target: ${steadyRent}
      </h3>
      <p className="text-xs text-gray-300 mt-1">
        Use this breakdown to budget: save during free months, draw during paid months.
      </p>
    </div>

    {/* Info & Initial Savings Box with Edit Inputs Dropdown */}
    <div className="bg-[#2F2F2F] p-6 rounded-2xl shadow-lg space-y-4">
      {/* Initial Savings Card */}
      <div className="bg-white p-4 rounded-xl shadow-md text-black font-bold text-center text-xl">
        Initial Savings Required: ${seed}
      </div>

      {/* Edit Inputs Toggle */}
      <button
        onClick={() => setEditOpen(o => !o)}
        className="w-full py-2 bg-[#B69D74] text-white font-semibold rounded-lg shadow"
      >
        {editOpen ? 'Hide Inputs' : 'Edit Inputs'}
      </button>

      {/* Inputs & Free-Months Selector (dropdown) */}
      {editOpen && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Base Monthly Rent ($)</label>
            <input
              type="text"
              value={baseRentInput}
              onChange={e => setBaseRentInput(e.target.value)}
              placeholder="e.g. 2350"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#B69D74]"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">Lease Term (months)</label>
            <input
              type="text"
              value={leaseTermInput}
              onChange={e => setLeaseTermInput(e.target.value)}
              placeholder="e.g. 14"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#B69D74]"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">Select Free Months</label>
            <div className="relative h-10 bg-gray-700 rounded-full overflow-hidden">
              {Array.from({ length: leaseTerm }, (_, i) => i + 1).map(month => {
                const isFree = freeMonths.includes(month);
                return (
                  <div
                    key={month}
                    onClick={() => handleToggleMonth(month)}
                    className={`absolute top-0 h-full text-xs font-semibold flex items-center justify-center cursor-pointer transition-all ${isFree ? 'bg-[#B69D74] text-white' : 'text-gray-500'}`}
                    style={{ left: `${((month - 1) / leaseTerm) * 100}%`, width: `${100 / leaseTerm}%` }}
                  >
                    {month}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Chart */}
    <div className="bg-[#2F2F2F] p-4 rounded-lg">
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={tick => (tick === 0 ? 'Initial Savings' : tick)} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="balance" stroke="#B69D74" strokeWidth={2} dot={false} />
          {showRentLine && <Bar dataKey="rentDue" barSize={20} fillOpacity={0.3} fill="#4A90E2" />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>

    {/* Toggle Rent Bars */}
    <div className="flex items-center gap-2 text-sm">
      <label className="flex items-center gap-1">
        <input type="checkbox" checked={showRentLine} onChange={() => setShowRentLine(r => !r)} className="accent-[#B69D74]" />
        Show Rent Due Bars
      </label>
    </div>

    {/* Breakdown Toggle */}
    <button onClick={() => setShowBreakdown(b => !b)} className="w-full px-4 py-2 bg-[#B69D74] text-white font-semibold rounded-lg shadow">
      {showBreakdown ? 'Hide' : 'Show'} Monthly Budget Breakdown
    </button>

    {/* Monthly Budget Breakdown */}
    {showBreakdown && (
      <div className="grid grid-cols-5 gap-2 text-sm text-center">
        {/* Headers */}
        <div className="font-bold">Month</div>
        <div className="font-bold">Rent Due</div>
        <div className="font-bold">Steady Target</div>
        <div className="font-bold">Save/Use</div>
        <div className="font-bold">Reserve</div>

        {/* Initial Savings row */}
        <React.Fragment key="initial">
          <div>Initial Savings</div>
          <div>$0</div>
          <div>$0</div>
          <div className="text-green-400">+{seed}</div>
          <div>${seed}</div>
        </React.Fragment>

        {/* Months 1–N */}
        {budgetPlan.filter(item => item.month > 0).map(item => (
          <React.Fragment key={item.month}>
            <div>{item.month}</div>
            <div>${item.isFree ? 0 : baseRent}</div>
            <div>${steadyRent}</div>
            <div className={item.delta > 0 ? "text-green-400" : "text-red-400"}>{item.delta > 0 ? `+${item.delta}` : `${item.delta}`}</div>
            <div>${item.balance}</div>
          </React.Fragment>
        ))}

        {/* Phantom Final Adjustment */}
        <React.Fragment key="final">
          <div className="italic">Final Reserve</div>
          <div className="col-span-3" />
          <div className="text-green-400">${seed}</div>
        </React.Fragment>
      </div>
    )}

    {/* Navigation Buttons */}
    <div className="flex gap-2">
      <button onClick={() => setPage(2)} className="flex-1 bg-gray-600 py-2 rounded-lg text-white shadow">Back</button>
      <button onClick={resetCalculator} className="flex-1 bg-red-600 py-2 rounded-lg text-white shadow">Reset</button>
    </div>
  </div>
)}

      </div>
    </main>
  );
}
