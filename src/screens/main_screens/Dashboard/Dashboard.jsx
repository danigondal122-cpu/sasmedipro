import React, { useEffect, useState } from "react";
import { useSales } from "../../../contexts/SaleContext";
import { useDeliveries } from "../../../contexts/DeliveryContext";
import { useItems } from "../../../contexts/ItemContext";
import DashboardProfitChart from "./analytics/AnalyticsDashboard";
import { usePurchases } from "../../../contexts/PurchaseContext";

export default function DashboardPage() {
  const { sales, fetchSales, meta: salesMeta } = useSales();
  const { deliveries, fetchDeliveries, meta: deliveriesMeta } = useDeliveries();
  const { items, fetchItems, meta: itemsMeta } = useItems();
  const {purchases,fetchPurchases, meta:purchaseMeta} = usePurchases();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        await fetchSales({ page: 1 });
        await fetchDeliveries({ page: 1 });
        await fetchItems({ page: 1 });
        await fetchPurchases({ page: 1})
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Dashboard</h1>

      <DashboardProfitChart />

      
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-label">Total Sales</div>
          <div className="card-value">{salesMeta.total ?? sales.length}</div>
        </div>

        <div className="dashboard-card">
          <div className="card-label">Total Deliveries</div>
          <div className="card-value">{deliveriesMeta.total ?? deliveries.length}</div>
        </div>

        <div className="dashboard-card">
          <div className="card-label">Total Items</div>
          <div className="card-value">{itemsMeta.total ?? items.length}</div>
        </div>

         <div className="dashboard-card">
          <div className="card-label">Total Purchases</div>
          <div className="card-value">{purchaseMeta.total ?? purchases.length}</div>
        </div>

        
      </div>



      
      


      


      

      

      {/* {loading && <p className="dashboard-loading">Loading data...</p>} */}
    </div>
  );
}