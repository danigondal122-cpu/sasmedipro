// pages/delivery/DeliveryDataTable.jsx
import React, { useEffect, useState } from "react";
import { useDeliveries } from "../../../../contexts/DeliveryContext.jsx";
import { useSales } from "../../../../contexts/SaleContext";
import Pagination from "../../../../components/Pagination.jsx";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import DeleteDeliveryConfirm from "./DeleteDeliveryConfirm.jsx";
import BulkActionBar from "../../../../components/BulkActionBar";
import { useBulkSelection } from "../../../../hooks/useBulkSelection";
import useResponsive from "../../../../hooks/useResponsive.js";






export default function DeliveryDataTable() {
  const { deliveries, fetchDeliveries, loading, meta, deleteDelivery, bulkDeleteDeliveries, bulkUpdateDeliveryStatus,} = useDeliveries();
  const { sales } = useSales(); // for associating deliveries with sales
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const {isMobile,isSmallMobile}=useResponsive()

  useEffect(() => {
    fetchDeliveries({ search, page: currentPage });
  }, [currentPage, search]);


  const {
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
  } = useBulkSelection(deliveries);

  return (
    <div className="data-table-container">
      <div className="data-table">

        <div className="table-header">
           <BulkActionBar
            selectedCount={selectedIds.length}
            onClear={clearSelection}
            actions={[
              {
                value: "pending",
                label: `Mark Pending (${selectedIds.length})`,
                onClick: async () => {
                  await bulkUpdateDeliveryStatus(selectedIds, "pending");
                  clearSelection();
                  fetchDeliveries({ search, page: currentPage });
                },
              },
              {
                value: "shipped",
                label: `Mark Shipped (${selectedIds.length})`,
                onClick: async () => {
                  await bulkUpdateDeliveryStatus(selectedIds, "shipped");
                  clearSelection();
                  fetchDeliveries({ search, page: currentPage });
                },
              },
              {
                value: "delivered",
                label: `Mark Delivered (${selectedIds.length})`,
                onClick: async () => {
                  await bulkUpdateDeliveryStatus(selectedIds, "delivered");
                  clearSelection();
                  fetchDeliveries({ search, page: currentPage });
                },
              },
              {
                value: "failed",
                label: `Mark Failed (${selectedIds.length})`,
                onClick: async () => {
                  await bulkUpdateDeliveryStatus(selectedIds, "failed");
                  clearSelection();
                  fetchDeliveries({ search, page: currentPage });
                },
              },
              {
                value: "delete",
                label: `Delete (${selectedIds.length})`,
                onClick: async () => {
                  await bulkDeleteDeliveries(selectedIds);
                  clearSelection();
                  fetchDeliveries({ search, page: currentPage });
                },
              },
            ]}
          />

          <input
            type="text"
            placeholder="Search deliveries..."
            className="table-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <button
            className="emerald-btn"
            onClick={() => navigate("/delivery/add")}
          >
            <AddIcon fontSize="small" /> Add Delivery
          </button> */}
        </div>

       <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
              <th>#</th>
              <th>Delivery ID</th>
              <th>Sale Invoice</th>
              <th>Status</th>
            {(!isMobile && !isSmallMobile) &&  <th>Created At</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            ) : deliveries.length === 0 ? (
              <tr>
                <td colSpan="7">No deliveries found</td>
              </tr>
            ) : (
              deliveries.map((delivery, index) => (
                <tr key={delivery.id}>
                   <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(delivery.id)}
                        onChange={() => toggleSelectOne(delivery.id)}
                      />
                    </td>
                  <td>{(meta.current_page - 1) * meta.per_page + index + 1}</td>
                  <td>{delivery.id}</td>
                  <td>{delivery.sale?.invoiceNo || "N/A"}</td>
                  <td>{delivery.status}</td>
                   {(!isMobile && !isSmallMobile) &&   <td>{new Date(delivery.createdAt).toLocaleString()}</td> }
                  <td className="action-icons">
                    <EditIcon
                      onClick={() => navigate(`/delivery/edit/${delivery.id}`)}
                    />
                    <DeleteOutlineIcon
                      onClick={() => {
                        setActiveDelivery(delivery);
                        setShowDeleteModal(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        <div className="table-footer">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <div className="table-info">
            Showing {deliveries.length} deliveries
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteModal && activeDelivery && (
        <div className="modal">
          <div className="modal-content">
            
         {showDeleteModal && activeDelivery && (
  <DeleteDeliveryConfirm
    delivery={activeDelivery}
    onClose={() => setShowDeleteModal(false)}
  />
)}
          </div>
        </div>
      )}
    </div>
  );
}