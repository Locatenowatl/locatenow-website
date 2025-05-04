import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function Calculator() {
  const [leaseTermInput, setLeaseTermInput] = useState("");
  const [baseRentInput, setBaseRentInput] = useState("");
  const [page, setPage] = useState<1 | 2 | 3>(1);
  const [freeMonths, setFreeMonths] = useState<number[]>([]);

  const leaseTerm = parseInt(leaseTermInput);
  const baseRent = parseFloat(baseRentInput);

  const proratedRent = useMemo(() => {
    if (!leaseTerm || !baseRent || freeMonths.length === 0) return 0;
    const totalRent = baseRent * leaseTerm;
    const freeRent = baseRent * freeMonths.length;
    const adjustedRent = totalRent - freeRent;
    return Math.round(adjustedRent / leaseTerm);
  }, [leaseTerm, baseRent, freeMonths]);

  const handleToggleMonth = (month: number) => {
    setFreeMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const savingsPlan = useMemo(() => {
    if (!leaseTerm || !baseRent || freeMonths.length === 0) return [];
    const plan = [];
    let savingsBalance = 0;
    for (let i = 1; i <= leaseTerm; i++) {
      const isFree = freeMonths.includes(i);
      const rentDue = isFree ? 0 : Math.round(baseRent);
      const savingsAdjustment = isFree
        ? proratedRent
        : Math.round(proratedRent - baseRent);
      savingsBalance += savingsAdjustment;
      plan.push({
        month: i,
        rentDue,
        savingsAdjustment,
        savingsBalance: Math.round(savingsBalance),
      });
    }
    return plan;
  }, [leaseTerm, baseRent, proratedRent, freeMonths]);

  const resetCalculator = () => {
    setLeaseTermInput("");
    setBaseRentInput("");
    setFreeMonths([]);
    setPage(1);
  };

  return (
    <main className="bg-[#1A1A1A] text-white min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#B69D74]">
          Proration Budgeting Calculator
        </h1>

        {page === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Base Monthly Rent ($):</label>
              <input
                type="text"
                value={baseRentInput}
                onChange={(e) => setBaseRentInput(e.target.value)}
                placeholder="e.g. 2350"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Lease Term (months):</label>
              <input
                type="text"
                value={leaseTermInput}
                onChange={(e) => setLeaseTermInput(e.target.value)}
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
              {Array.from({ length: leaseTerm }, (_, i) => i + 1).map((month) => (
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
            {proratedRent > 0 && (
              <div className="text-center pt-2 text-sm">
                Estimated Prorated Rent: <strong>${proratedRent}</strong>
              </div>
            )}
            <button
              onClick={() => setPage(3)}
              disabled={freeMonths.length === 0}
              className={cn(
                "w-full mt-4 px-4 py-2 rounded",
                freeMonths.length > 0
                  ? "bg-[#B69D74] text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              )}
            >
              View Budget Plan
            </button>
          </div>
        )}

        {page === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Your Monthly Budget Plan</h3>
            <div className="grid grid-cols-4 gap-2 text-sm text-center">
              <div className="font-bold">Month</div>
              <div className="font-bold">Rent Due</div>
              <div className="font-bold">Save / Use</div>
              <div className="font-bold">Savings Balance</div>
              {savingsPlan.map((item) => (
                <React.Fragment key={item.month}>
                  <div>{item.month}</div>
                  <div>${item.rentDue}</div>
                  <div
                    className={item.rentDue === 0 ? "text-green-400" : "text-red-400"}
                  >
                    {item.rentDue === 0
                      ? `+ Save $${item.savingsAdjustment}`
                      : `– Use $${Math.abs(item.savingsAdjustment)}`}
                  </div>
                  <div>${item.savingsBalance}</div>
                </React.Fragment>
              ))}
            </div>
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
