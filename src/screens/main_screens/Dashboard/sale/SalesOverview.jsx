import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useSales } from "../../../../contexts/SaleContext";
import { useEffect, useState } from "react";

import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { PieChart, Pie, Cell } from "recharts";
import { formatNumber } from "../../../../heplers/common";

const donutData = [
  { name: "Completed", value: 70 },
  { name: "Pending", value: 20 },
  { name: "Cancelled", value: 10 },
];

const COLORS = ["#014f35", "#00a870", "#e6f4ef"];

export default function SalesOverview() {
  const { report, fetchSaleReport } = useSales();
  const [tab, setTab] = useState("daily");
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");



  // Update chart data based on selected tab
useEffect(() => {
  if (!report) {
    setChartData([]);
    return;
  }

  let data = [];

  if (selectedMonth) {
    // Month selected → always use daily_matrix
    data = report.daily_matrix || [];
    setChartData(
      data.map((d, i) => ({
        id: i,
        day: d.day,      // or d.date if you want full date
        sales: Number(d.sales) || 0,
      }))
    );
  } else {
    // No month → show tab data
    if (tab === "daily") {
      data = report.daily || [];
      setChartData(
        data.map((d, i) => ({
          id: i,
          day: d.day,
          sales: Number(d.sales) || 0,
        }))
      );
    } else if (tab === "weekly") {
      data = report.weekly || [];
      setChartData(
        data.map((d, i) => ({
          id: i,
          day: `W${d.week}`,
          sales: Number(d.sales) || 0,
        }))
      );
    } else if (tab === "monthly") {
      data = report.monthly || [];
      setChartData(
        data.map((d, i) => ({
          id: i,
          day: d.month,
          sales: Number(d.sales) || 0,
        }))
      );
    }
  }
}, [tab, report, selectedMonth]);



useEffect(() => {
  if (selectedMonth) {
    fetchSaleReport(selectedMonth);
  }else{
    fetchSaleReport();
  }
}, [selectedMonth]);


const handleTabClick = (newTab) => {
  setTab(newTab);
  setSelectedMonth(""); // reset month on tab change
};


  return (
    <div className="sales-card">
      {/* Header */}
      <div className="sales-header">
        <h2 className="sales-title">
          <span className="lightning-symbol">
            <ElectricBoltOutlinedIcon sx={{ fontSize: 38 }} />
          </span>
          Sales Overview
        </h2>
        <div className="date-select-wrapper">
          <CalendarTodayOutlinedIcon className="calendar-icon" />
      <select
  className="date-select"
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(e.target.value)}
>
  {report?.month_options
    ?.slice()           // create a copy so original array is not mutated
    .reverse()         // reverse order: latest month first
    .map((m) => (
      <option key={m.value} value={m.value}>
        {m.label}
      </option>
    ))
  }
</select>
        </div>
      </div>

      {/* Tabs */}
    <div className="tabs">
  <button className={tab === "daily" ? "active" : ""} onClick={() => handleTabClick("daily")}>
    Daily
  </button>
  <button className={tab === "weekly" ? "active" : ""} onClick={() => handleTabClick("weekly")}>
    Weekly
  </button>
  <button className={tab === "monthly" ? "active" : ""} onClick={() => handleTabClick("monthly")}>
    Monthly
  </button>
</div>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
         <AreaChart key={`${tab}-${selectedMonth}`} data={chartData}>
            <CartesianGrid stroke="#016443" strokeDasharray="8 12" horizontal={false} vertical={true} />
            <XAxis tick={{ fill: "#9ca3af", fontSize: 12 }} dataKey="day" axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatNumber} tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Area
              type="linear"
              dataKey="sales"
              stroke="#016443"
              strokeWidth={1.5}
              fill="rgba(99, 166, 144, 0.1)"
              dot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Metrics */}
      {/* <div className="sales-footer">
        <div>
          <h4>Total Sales</h4>
          <p className="green">+0.2%</p>

          <div style={{ width: 120, height: 120 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={40}
                  outerRadius={55}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h4>Top Selling</h4>
          <p>Product A</p>
        </div>
      </div> */}


    </div>
  );
}