import { useEffect, useState, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const safe = (v) => Number(v) || 0;
const fmt = (v) => safe(v).toFixed(2);

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const uuid = params.get("token");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );

  useEffect(() => {
    fetchCommission();
  }, [month]);

  async function fetchCommission() {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/getUserCommissionReport/${month}`,
        {
          headers: {
            Accept: "application/json",
            code: import.meta.env.VITE_COM_CODE,
            uuid: uuid,
          },
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setData(json.data);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage text={error} />;

  return <CommissionUI data={data} month={month} setMonth={setMonth} />;
}

function CommissionUI({ data, month, setMonth }) {
  const { summary, downlines = [], user } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1d24] to-[#111218] text-white p-3 sm:p-4">
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <LeftSummary summary={summary} user={user} />
        <RightPanel
          summary={summary}
          downlines={downlines}
          month={month}
          setMonth={setMonth}
        />
      </div>
    </div>
  );
}

function LeftSummary({ summary, user }) {
  return (
    <div className="rounded-xl bg-[#262833]/80 backdrop-blur border border-white/5 shadow-lg p-4 space-y-3">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow">
          👤
        </div>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-400">+{user?.phone}</p>
        </div>
      </div>

      <SummaryRow
        label="TOTAL LIFETIME EARNED"
        value={summary.totalLifetimeEarned}
        color="text-cyan-400"
      />
      <SummaryRow
        label="TOTAL DEPOSITS"
        value={summary.totalDeposit}
        color="text-green-400"
      />
      <SummaryRow
        label="TOTAL WITHDRAWALS"
        value={summary.totalWithdraw}
        color="text-red-400"
      />
      <SummaryRow
        label="TOTAL BONUSES"
        value={summary.totalFoc}
        color="text-yellow-400"
      />
      <SummaryRow label="BROUGHT FORWARD WL" value={summary.carryForward} />

      <div className="border-t border-white/10 pt-3"></div>
      <SummaryRow label="THIS MONTH EARNING" value={summary.userProfit} />
      <SummaryRow
        label="BROUGHT FORWARD COMM"
        value={summary.previousForwardComission}
      />
      <SummaryRow
        label="TOTAL EARNING"
        value={summary.totalEarn}
        color="text-cyan-400"
      />

      <div>
        <p className="text-xs text-gray-400 mb-2">COMMISSION RATE</p>
        <div className="grid grid-cols-2 gap-2">
          <TierBox title="CURRENT" percent={summary.percentage} tier="Tier 1" />
          <TierBox
            title="NEXT"
            percent={summary.nextPercentage}
            tier="Tier 2"
          />
        </div>
      </div>
      <div className="bg-[#2f313c] rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
          Downline Totals
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Invited */}
          <div className="bg-[#3a3d4a] rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Invited</p>
              <p className="text-2xl font-semibold text-white">
                {summary.downlinesInvite ?? 0}
              </p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 4a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
          </div>

          {/* Active */}
          <div className="bg-[#3a3d4a] rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Active</p>
              <p className="text-2xl font-semibold text-white">
                {summary.downlinesActive ?? 0}
              </p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5S10.343 11 12 11zm0 2c-2.67 0-8 1.337-8 4v1h16v-1c0-2.663-5.33-4-8-4z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function RightPanel({ summary, downlines, month, setMonth }) {
  return (
    <div className="md:col-span-2 rounded-xl bg-[#262833]/80 backdrop-blur border border-white/5 shadow-lg p-4">
      {/* FILTER */}
      <div className="sticky top-0 z-10 bg-[#262833]/90 backdrop-blur rounded-lg mb-4 p-3 flex flex-col sm:flex-row gap-2">
        <MonthPicker month={month} setMonth={setMonth} />
        <button
          onClick={() => setMonth(new Date().toISOString().slice(0, 7))}
          className="bg-gradient-to-r from-teal-400 to-cyan-500 text-black px-4 py-2 rounded-lg font-semibold shadow"
        >
          RESET
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-white/10 pb-4">
        <MiniRow label="TOTAL DEPOSITS" value={summary.totalDeposit} />
        <MiniRow label="TOTAL WITHDRAWALS" value={summary.totalWithdraw} />
        <MiniRow label="TOTAL BONUSES" value={summary.totalFoc} />
        <MiniRow label="TOTAL WIN / LOSS" value={summary.totalWinLose} />
      </div>

      {/* DOWNLINES */}
      <DownlineList downlines={downlines} />
    </div>
  );
}
function DownlineList({ downlines }) {
  if (!downlines.length) return <Empty />;

  return (
    <>
      {/* MOBILE */}
      <div className="space-y-3 sm:hidden pt-4">
        {downlines.map((d, i) => (
          <div
            key={i}
            className="rounded-lg bg-[#1b1d24] p-3 border border-white/5"
          >
            <p className="font-semibold mb-1">{d.username}</p>
            <MiniRow label="Deposit" value={d.deposit} />
            <MiniRow label="Withdraw" value={d.withdraw} />
            <MiniRow label="Win/Loss" value={d.winlose} />
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <table className="hidden sm:table w-full text-sm mt-4">
        <thead className="text-gray-400 border-b border-white/10">
          <tr>
            <th className="text-left py-2">User</th>
            <th>Deposit</th>
            <th>Withdraw</th>
            <th>FOC</th>
            <th>Win/Loss</th>
          </tr>
        </thead>
        <tbody>
          {downlines.map((d, i) => (
            <tr key={i} className="border-b border-white/5">
              <td className="py-2">{d.name}</td>
              <td className="text-center">RM {fmt(d.deposit)}</td>
              <td className="text-center">RM {fmt(d.withdraw)}</td>
              <td className="text-center">RM {fmt(d.foc)}</td>
              <td className="text-center">RM {fmt(d.winlose)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function SummaryRow({ label, value, color = "text-gray-300" }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={`font-semibold ${color}`}>
        RM {Number(value || 0).toFixed(2)}
      </span>
    </div>
  );
}

function MiniRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">RM {Number(value || 0).toFixed(2)}</span>
    </div>
  );
}

function TierBox({ title, percent, tier }) {
  return (
    <div className="bg-[#1b1d24] rounded-lg p-3 text-center border border-white/10">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-xl font-bold text-cyan-400">{percent}%</p>
      <span className="text-xs text-teal-400">{tier}</span>
    </div>
  );
}

function Empty({ message = "No data available" }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      {/* Optional icon */}
      <svg
        className="w-12 h-12 mb-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2z"
        />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#111218]">
      <div className="w-full bg-[#262833] rounded-xl p-4 space-y-4 animate-pulse">
        <div className="h-8 w-1/2 bg-gray-700 rounded" />

        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-10 w-1/3 bg-gray-700 rounded" />
            <div className="h-10 w-1/4 bg-gray-600 rounded" />
          </div>
        ))}

        <div className="h-px bg-gray-700 my-2" />

        <div className="flex gap-2">
          <div className="flex-1 h-60 bg-[#1b1d24] rounded" />
          <div className="flex-1 h-60 bg-[#1b1d24] rounded" />
        </div>
      </div>
    </div>
  );
}
function ErrorMessage({ text }) {
  return (
    <div className="min-h-screen bg-[#111218] flex items-center justify-center">
      <div className="bg-red-600 text-white px-4 py-2 rounded-lg">{text}</div>
    </div>
  );
}

function MonthPicker({ month, setMonth }) {
  const inputRef = useRef(null);

  return (
    <div
      className="relative cursor-pointer"
      onClick={() =>
        inputRef.current?.showPicker?.() || inputRef.current?.click()
      }
    >
      <input
        ref={inputRef}
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="bg-[#1b1d24] text-white px-3 py-2 pr-10 rounded-lg border border-white/10
                   focus:outline-none focus:ring-2 focus:ring-teal-400
                   appearance-none w-full cursor-pointer"
      />

      {/* White calendar icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}
