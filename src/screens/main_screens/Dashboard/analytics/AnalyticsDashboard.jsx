import React, { useEffect, useState } from "react";
import { useApiServices } from "../../../../hooks/useApiServices";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatNumber } from "../../../../heplers/common";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

export default function DashboardProfitChart() {
  const { getApi } = useApiServices();
  const [report, setReport] = useState({});
  const [tab, setTab] = useState("daily");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chartData, setChartData] = useState([]);

  const [totals, setTotals] = useState({
  revenue: 0,
  profit: 0,
  purchase:0,
  loss: 0,
  creditSales:0,
  net: 0,
  loan:0
});



useEffect(() => {
  if (!report) return;

  let data = [];

  if (selectedMonth) {
    data = report.daily_matrix || [];
  } else {
    if (tab === "daily") data = report.daily || [];
    if (tab === "weekly") data = report.weekly || [];
    if (tab === "monthly") data = report.monthly || [];
  }

  let revenue = 0;
  let profit = 0;
  let creditSales = 0;
  let loss = 0;
  let purchase = 0;
  let loan=0;

  data.forEach((d) => {
    revenue += Number(d.revenue || 0);
    purchase += Number(d.cost || 0);

    const p = Number(d.profit || 0);

    creditSales +=Number(d.credit_sales)

     profit += Number(d.profit || 0);
     loan += Number(d.loan ||0);

    // if (p >= 0) profit += p;
    // else loss += Math.abs(p);
  });
  const net = profit.toFixed(2);

  setTotals({ revenue, profit, loss,creditSales,net, purchase,loan});

}, [report, tab, selectedMonth]);

  const fetchReport = async (month = "") => {
    try {
      const res = await getApi("/analytics/reports", { month }, { isToken: true });
      if (!res.isSuccess) throw new Error(res.message);
      setReport(res.data);
    } catch (err) {
      console.error("fetchProfitReport:", err);
    }
  };

  useEffect(() => {
    fetchReport(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    if (!report) return;

    let data = [];
    if (selectedMonth) {
      data = report.daily_matrix || [];
      setChartData(data.map((d, i) => ({ id: i, day: d.day, profit: Number(d.profit) || 0 })));
    } else {
      if (tab === "daily") data = report.daily || [];
      else if (tab === "weekly") data = report.weekly || [];
      else if (tab === "monthly") data = report.monthly || [];

      setChartData(data.map((d, i) => ({
        id: i,
        day: tab === "weekly" ? `W${d.week}` : d.day || d.month,
        profit: Number(d.profit) || 0,
      })));
    }
  }, [report, tab, selectedMonth]);

  return (
    <div className="dashboard-profit-chart  sales-card">


      <div className="dashboard-cards analytics-cards">
  
  <div className="dashboard-card overall-card">
  <div className="card-label">Overall Profit</div>
  <div className={`card-value ${totals.net >= 0 ? "text-green" : "text-red"}`}>
    {formatNumber(totals.net)}
  </div>
</div>

  <div className="dashboard-card">
    <div className="card-label">Total Revenue</div>
    <div className="card-value">{formatNumber(totals.revenue)}</div>
  </div>


  <div className="dashboard-card">
    <div className="card-label">Total Sales Credit</div>
    <div className="card-value">{formatNumber(totals.creditSales)}</div>
  </div>

  <div className="dashboard-card">
    <div className="card-label">Total Loan</div>
    <div className="card-value text-green">
      {formatNumber(totals.loan)}
    </div>
  </div>

  {/* <div className="dashboard-card">
    <div className="card-label">Total Loss</div>
    <div className="card-value text-red">
      {formatNumber(totals.loss)}
    </div>
  </div> */}



   <div className="dashboard-card">
    <div className="card-label">Total Purchase</div>
    <div className="card-value text-red">
      {formatNumber(totals.purchase)}
    </div>
  </div>

</div>


         <div className="date-select-wrapper">
         <CalendarTodayOutlinedIcon className="calendar-icon" />
        <select  className="date-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">Select Month</option>
          {report?.month_options?.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>
      
      <div className="tabs">
        <button className={tab === "daily" ? "active" : ""} onClick={() => { setTab("daily"); setSelectedMonth(""); }}>Daily</button>
        <button className={tab === "weekly" ? "active" : ""} onClick={() => { setTab("weekly"); setSelectedMonth(""); }}>Weekly</button>
        <button className={tab === "monthly" ? "active" : ""} onClick={() => { setTab("monthly"); setSelectedMonth(""); }}>Monthly</button>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart key={`${tab}-${selectedMonth}`} data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" horizontal={false} vertical={true}/>
            <XAxis dataKey="day" tick={{ fill: "#9ca3af" }} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={formatNumber} tick={{ fill: "#9ca3af" }} axisLine={false} tickLine={false}/>
         <Tooltip 
  formatter={(value, name) => {
    if (value < 0) return [formatNumber(Math.abs(value)), "Purchase"]; // show as Purchase: <value>
    return [formatNumber(value), name]; // keep normal
  }}
/>
            <Area type="linear" dataKey="profit" stroke="#016443" fill="rgba(0,168,112,0.1)" dot={{ r: 4 }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

   
    </div>
  );
}