function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-semibold">
            Total Revenue
          </p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            $24,500
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-semibold">
            Orders
          </p>
          <p className="text-2xl font-bold font-mono text-blue-600 mt-2">
            1,240
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-semibold">
            Active Customers
          </p>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-2">
            890
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
