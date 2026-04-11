import React, { useState, useEffect, useRef } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/Add";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Pagination from "../../../../components/Pagination.jsx";
import AddInventoryForm from "./AddItemForm.jsx";
import html2pdf from "html2pdf.js";
import DeleteItemConfirm from "./DeleteItemForm.jsx";
import EditItemForm from "./EditItemForm.jsx";
import { useNavigate } from "react-router-dom";

import BulkActionBar from "../../../../components/BulkActionBar";
import { useBulkSelection } from "../../../../hooks/useBulkSelection";
import useResponsive from "../../../../hooks/useResponsive.js";


import { useItems } from "../../../../contexts/ItemContext.jsx";
import { truncateText } from "../../../../heplers/textHelpers.js";
export default function ItemDataTable() {
  const navigate = useNavigate();
  const { items, fetchItems, loading,meta,bulkDeleteItems  } = useItems();

  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
   const [showEditModal, setShowEditModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [activeItem, setActiveItem] = useState(null);

 const {isTablet,isSmallMobile,isMobile,isDesktop,isLargeDesktop,isDesktopUp}=useResponsive()


const {
  selectedIds,
  isAllSelected,
  toggleSelectAll,
  toggleSelectOne,
  clearSelection,
} = useBulkSelection(items);

  const tableRef = useRef();
  const pdfRef = useRef();

  // 🔹 Load items from API
  useEffect(() => {
    fetchItems({ search, page: currentPage });
   
  }, [currentPage, search]);

  // 🔹 PDF download
  const handleDownload = () => {
    const opt = {
      margin: 0,
      filename: `items_inventory_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
    };
    html2pdf().set(opt).from(tableRef.current).save();
  };

  const showingText = `Showing ${items.length} of ${meta.total} items`;

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
          await bulkDeleteItems(selectedIds);
          clearSelection();
        } catch (err) {
          console.error(err);
        }
      },
    },
  ]}
/>

  
          <div className="table-search-wrapper">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search items"
              className="table-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // onKeyUp={() => fetchItems({ search })}
            />
          </div>

          <div className="table-buttons">
            <button className="emerald-btn" onClick={() => navigate(`/items/add`)}>
              <AddIcon fontSize="small" /> Add Item
            </button>
            {/* <button className="emerald-btn">
              <LowPriorityIcon fontSize="small" /> Low Stocks
            </button>
            <button className="emerald-btn">
              <DeleteOutlineIcon fontSize="small" /> Trashed List
            </button> */}
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
                <th>Item No</th>
                <th>Item Name</th>
                {(!isMobile && !isSmallMobile ) && <th>Batch</th>}
                <th>U/Price</th>
                {(!isMobile && !isSmallMobile ) &&     <th>Stock</th>}
                 {!isSmallMobile &&   <th>Tax %</th> }
                
   {isDesktop && <th>Expiry</th> }
               {isLargeDesktop &&  <th>Total Value</th>}
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11">Loading...</td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id}>
                    <td>
  <input
    type="checkbox"
    checked={selectedIds.includes(item.id)}
    onChange={() => toggleSelectOne(item.id)}
  />
</td>

                    <td>{index + 1}</td>
                    <td>{item.itemNo}</td>
                    <td>{truncateText(item.itemName,16)}</td>
                  {(!isMobile && !isSmallMobile ) &&   <td>{truncateText(item.batchNumber,18)}</td>}
                  
                    <td>{item.price.toFixed(2)}</td>
                  {(!isMobile && !isSmallMobile ) &&   <td>{item.qty}</td> }
                 {!isSmallMobile &&  <td>{item.tax}%</td>}
                 {isDesktop &&    <td>{item.expiryDate}</td>}
                   {isLargeDesktop && <td>{item.totalValue.toFixed(2)}</td>}
                    <td className="action-icons">
                      <EditIcon
  fontSize="small"
  onClick={() => navigate(`/items/edit/${item.id}`)}
  style={{ cursor: "pointer" }}
/>
  <DeleteOutlineIcon
    fontSize="small"
    onClick={() => {
      setActiveItem(item);
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
          <div className="table-info">{showingText}</div>
        </div>

        {/* Add Item Modal */}
        {/* {showAddModal && (
          <AddInventoryForm
            onClose={() => setShowAddModal(false)}
          />
        )} */}

{/* 
        {showEditModal && (
  <EditItemForm
    item={activeItem}
    onClose={() => setShowEditModal(false)}
  />
)} */}

{showDeleteModal && (
  <DeleteItemConfirm
    item={activeItem}
    onClose={() => setShowDeleteModal(false)}
  />
)}
      </div>
    </div>
  );
}
