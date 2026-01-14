function CommissionUI({ data }) {
  const { summary } = data;

  const Row = ({ label, value, color }) => (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={color}>{`RM ${value.toFixed(2)}`}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1f2128] text-white p-4">
      <div className="max-w-md mx-auto bg-[#2a2d36] rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold">Commission Report</h2>

        <Row
          label="Total Deposit"
          value={summary.totalDeposit}
          color="text-green-400"
        />
        <Row
          label="Total Withdraw"
          value={summary.totalWithdraw}
          color="text-red-400"
        />
        <Row
          label="Total Bonus"
          value={summary.totalFoc}
          color="text-yellow-400"
        />
        <Row
          label="Win / Loss"
          value={summary.totalWinLose}
          color="text-blue-400"
        />

        <div className="border-t border-gray-600 pt-3">
          <Row
            label="This Month Earning"
            value={summary.userProfit}
            color="text-cyan-400"
          />
          <Row
            label="Carry Forward"
            value={summary.carryForward}
            color="text-gray-300"
          />
        </div>

        <div className="flex justify-between gap-2 pt-3">
          <div className="bg-[#1f2128] p-3 rounded w-full text-center">
            <p className="text-sm text-gray-400">Current</p>
            <p className="text-xl font-bold">{summary.percentage}%</p>
            <span className="text-xs text-green-400">Tier 1</span>
          </div>
          <div className="bg-[#1f2128] p-3 rounded w-full text-center">
            <p className="text-sm text-gray-400">Next</p>
            <p className="text-xl font-bold">25%</p>
            <span className="text-xs text-green-400">Tier 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
