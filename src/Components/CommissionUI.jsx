function CommissionUI({
  data,
  totalSum,
  currentPage,
  totalPage,
  onPageChange,
}) {
  const fmt = (v) => Number(v || 0).toFixed(2);

  const columns = [
    { key: "user_id", label: "用户ID" },
    { key: "user_name", label: "用户名称" },
    { key: "user_uuid", label: "用户UUID" },
    { key: "user_username", label: "用户账号" },
    { key: "total_amount", label: "佣金总金额", format: fmt },
    { key: "total_earn", label: "实际收益", format: fmt },
    { key: "total_deposit", label: "总存款", format: fmt },
    { key: "total_withdraw", label: "总提款", format: fmt },
    { key: "total_foc", label: "总FOC", format: fmt },
    { key: "total_win_lose", label: "总输赢", format: fmt },
    { key: "last_commission_date", label: "最后佣金日期" },
    { key: "total_records", label: "记录数量" },
  ];

  return (
    <div className="min-h-screen bg-[#1f2128] text-white p-4">
      <div className="max-w-6xl mx-auto bg-[#2a2d36] rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Commission Report</h2>
          <span className="text-sm text-cyan-400 font-semibold">
            Total: RM {fmt(totalSum)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-600">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left py-2 px-2 whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={item.user_id ?? i}
                  className="border-b border-gray-700"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-2 px-2 whitespace-nowrap">
                      {col.format ? col.format(item[col.key]) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-400"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPage > 1 && (
          <div className="flex justify-center items-center gap-2 pt-3">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 rounded bg-[#1f2128] disabled:opacity-40"
            >
              ‹
            </button>
            <span className="text-sm text-gray-400">
              {currentPage} / {totalPage}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPage}
              className="px-3 py-1 rounded bg-[#1f2128] disabled:opacity-40"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommissionUI;
