import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CreateGraph = ({ prices }) => {
  const chartData = prices.map(([timestamp, price]) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
    return {
      date: formattedDate,
      price: parseFloat(price.toFixed(4)),
    };
  });

  return (
    <div className="w-full h-[350px] sm:h-[400px] bg-white border border-gray-200 rounded-2xl shadow-md p-4 sm:p-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 25, left: 5, bottom: 40 }}
        >
          {/* Gradient fill */}
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* X-Axis - show all 30 days properly spaced */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, angle: -35, dy: 20, fill: "#4b5563" }}
            stroke="#9ca3af"
            interval={0} // show all ticks
            height={70}
            tickMargin={10}
          />

          {/* Y-Axis - around 10 ticks */}
          <YAxis
            domain={["auto", "auto"]}
            tickCount={10}
            width={70}
            stroke="#9ca3af"
            tick={{ fontSize: 12, fill: "#4b5563" }}
          />

          {/* Tooltip styling */}
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
            }}
            formatter={(value) => [`$${value}`, "Price"]}
            labelStyle={{ color: "#111827", fontWeight: "600" }}
            itemStyle={{ color: "#3b82f6" }}
          />

          {/* Area line */}
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#colorArea)"
            dot={false}
            activeDot={{ r: 5, fill: "#2563eb", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CreateGraph;
