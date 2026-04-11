import React, { useEffect, useState, useRef } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Pagination from "../../../../components/Pagination.jsx";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";

import BulkActionBar from "../../../../components/BulkActionBar";
import { useBulkSelection } from "../../../../hooks/useBulkSelection";

import { usePurchases } from "../../../../contexts/PurchaseContext.jsx";
import DeletePurchaseConfirm from "./DeletePurchaseConfirm.jsx";
import { truncateText } from "../../../../heplers/textHelpers.js";
export default function PurchaseDataTable() {
  const navigate = useNavigate();
  const {
    purchases,
    fetchPurchases,
    loading,
    meta,
    deletePurchase,
  } = usePurchases();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");


  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [activePurchase, setActivePurchase] = useState(null);

  const tableRef = useRef();

  // ✅ Bulk selection
  const {
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
  } = useBulkSelection(purchases);

  // 🔹 Load purchases
  useEffect(() => {
    fetchPurchases({ search, page: currentPage });
  }, [currentPage, search]);

  // 🔹 PDF Download
  const handleDownload = () => {
    const opt = {
      margin: 0,
      filename: `purchases_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
    };
    html2pdf().set(opt).from(tableRef.current).save();
  };

  const showingText = `Showing ${purchases.length} of ${meta.total} purchases`;

  return (
    <div className="data-table-container">
      <div className="data-table">

        {/* Header */}
        <div className="table-header">

          <BulkActionBar
            selectedCount={selectedIds.length}
            onClear={clearSelection}
            actions={[
              {
                value: "delete",
                label: `Delete (${selectedIds.length})`,
                onClick: async () => {
                  try {
                    for (let id of selectedIds) {
                      await deletePurchase(id);
                    }
                    clearSelection();
                  } catch (err) {
                    console.error(err);
                  }
                },
              },
            ]}
          />

          {/* Search */}
          <div className="table-search-wrapper">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search purchases"
              className="table-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="table-buttons">
            <button
              className="emerald-btn"
              onClick={() => navigate(`/purchase/add`)}
            >
              <AddIcon fontSize="small" /> Add Purchase
            </button>

            <button className="emerald-btn" onClick={handleDownload}>
              <DownloadOutlinedIcon fontSize="small" /> Download PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div ref={tableRef}>
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
                  <th>Purchase No.</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Shipping</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9">Loading...</td>
                  </tr>
                ) : (
                  purchases.map((p, index) => (
                    <tr key={p.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p.id)}
                          onChange={() => toggleSelectOne(p.id)}
                        />
                      </td>

                      <td>{index + 1}</td>
                      <td>{p.purchase_no}</td>
                      <td>{truncateText(p.productName,18)}</td>
                      <td>{p.price.toFixed(2)}</td>
                      <td>{p.amount}</td>
                      <td>{p.shipping.toFixed(2)}</td>
                      <td>{p.total.toFixed(2)}</td>

                      <td className="action-icons">
                          <EditIcon
  fontSize="small"
  onClick={() => navigate(`/purchase/edit/${p.id}`)}
  style={{ cursor: "pointer" }}
/>

                       <DeleteOutlineIcon
  fontSize="small"
  style={{ cursor: "pointer" }}
  onClick={() => {
    setActivePurchase(p);
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
        </div>

        {/* Footer */}
        <div className="table-footer">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onPageChange={(page) => setCurrentPage(page)}
          />

          {showDeleteModal && (
  <DeletePurchaseConfirm
    purchase={activePurchase}
    onClose={() => setShowDeleteModal(false)}
  />
)}
          <div className="table-info">{showingText}</div>
        </div>

      </div>
    </div>
  );
}