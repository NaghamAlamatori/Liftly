import React from "react";
import { LayoutDashboard, Tag, Users, FileText, TrendingUp } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function DashboardPage() {
  const metrics = [
    { title: "Products", value: 15853, prevValue: 14500, icon: Tag },
    { title: "Users", value: 30, prevValue: 24, icon: Users },
    { title: "Articles", value: 455, prevValue: 400, icon: FileText },
    { title: "Earning", value: 10235, prevValue: 9000, icon: TrendingUp },
  ];

  // 🔥 Dummy earnings data
  const monthlyData = [
    { month: "Jan", value: 320 },
    { month: "Feb", value: 420 },
    { month: "Mar", value: 390 },
    { month: "Apr", value: 540 },
    { month: "May", value: 610 },
    { month: "Jun", value: 580 },
    { month: "Jul", value: 720 },
    { month: "Aug", value: 690 },
    { month: "Sep", value: 820 },
    { month: "Oct", value: 910 },
    { month: "Nov", value: 1020 },
    { month: "Dec", value: 1150 },
  ];

  // ✅ REAL PRO SCALING (pixel-based)
  const CHART_HEIGHT = 256; // matches h-64
  const maxValue = Math.max(...monthlyData.map((m) => m.value));

  const chartData = monthlyData.map((m, index) => {
    const visualHeight = (m.value / maxValue) * CHART_HEIGHT;

    return {
      ...m,
      height: `${visualHeight}px`,
      highlighted: index === monthlyData.length - 1,
    };
  });

  const totalCustomers = 65;
  const prevCustomers = 50;
  const customerGrowth = ((totalCustomers - prevCustomers) / prevCustomers) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminSidebar />

      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="text-yellow-400" size={32} />
          <h1 className="text-3xl font-normal text-yellow-400">Dashboard</h1>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {metrics.map(({ title, value, prevValue, icon: Icon }) => {
            const growth = ((value - prevValue) / prevValue) * 100;
            const growthColor = growth >= 0 ? "text-green-400" : "text-red-400";

            return (
              <div
                key={title}
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 shadow-lg shadow-yellow-400/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-yellow-300/80">{title}</span>
                  <Icon className="text-yellow-400" size={20} />
                </div>

                <p className="text-2xl font-bold mb-1">
                  {value.toLocaleString()}
                </p>

                <p className={`text-xs ${growthColor}`}>
                  {growth >= 0 ? "↑" : "↓"} {Math.abs(growth).toFixed(1)}% this
                  month
                </p>
              </div>
            );
          })}
        </div>

        {/* Overview + Customers */}
        <div className="grid grid-cols-3 gap-6">
          {/* Overview Bar Chart */}
          <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              Overview
            </h2>
            <p className="text-sm text-gray-500 mb-6">Monthly Earning</p>

            <div className="flex items-end h-64 gap-3">
              {chartData.map(({ month, value, height, highlighted }) => (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex items-end justify-center">
                    {highlighted && (
                      <div className="absolute -top-8 bg-white text-black text-xs px-2 py-1 rounded-md">
                        {value}
                      </div>
                    )}

                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        highlighted
                          ? "bg-yellow-400 shadow-lg shadow-yellow-400/50"
                          : "bg-yellow-400/70"
                      }`}
                      style={{
                        height,
                        minHeight: "20px",
                      }}
                    />
                  </div>

                  <span
                    className={`mt-2 text-xs ${
                      highlighted
                        ? "text-yellow-400 font-semibold"
                        : "text-yellow-300/50"
                    }`}
                  >
                    {month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customers Donut */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              Customers
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Customers that buy products
            </p>

            <div className="flex justify-center items-center relative">
              <svg className="w-56 h-56 -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#2a2a2a"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="20"
                  strokeDasharray={`${2 * Math.PI * 80 * (totalCustomers / 100)} ${
                    2 * Math.PI * 80
                  }`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-4xl font-bold text-yellow-400 mb-1">
                  {totalCustomers}%
                </p>
                <p className="text-xs text-yellow-300/70">New Customers</p>
              </div>
            </div>

            <p
              className={`mt-4 text-xs ${
                customerGrowth >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {customerGrowth >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(customerGrowth).toFixed(1)}% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
