import React, { useState, useEffect, useRef } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Pagination from "../../../../components/Pagination.jsx";
import AddInventoryForm from "./AddInventoryPage.jsx";
import EditInventoryForm from "./EditInventoryForm.jsx";
import DeleteInventoryConfirm from "./DeleteInventoryConfirm.jsx";
import html2pdf from "html2pdf.js";
import { useInventories } from "../../../../contexts/InventoryContext";
import { useItems } from "../../../../contexts/ItemContext";
import { useNavigate } from "react-router-dom";

import BulkActionBar from "../../../../components/BulkActionBar";
import { useBulkSelection } from "../../../../hooks/useBulkSelection";
import useResponsive from "../../../../hooks/useResponsive.js";
import { truncateText } from "../../../../heplers/textHelpers.js";

export default function InventoryDataTable() {
  const { inventories, fetchInventories, loading, meta,bulkDeleteInventories } = useInventories();
  const { fetchItems,items } = useItems(); // For item selection in Add/Edit

  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeInventory, setActiveInventory] = useState(null);

  const navigate = useNavigate();

  const tableRef = useRef();

   const {isTablet,isSmallMobile,isMobile,isDesktop,isLargeDesktop,isDesktopUp}=useResponsive()
  


  
  const {
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
  } = useBulkSelection(inventories);
  


   useEffect(() => {
    // Load items once for select dropdowns
    fetchItems();
  }, []);


  useEffect(() => {
    fetchInventories({ search, page: currentPage });
  }, [currentPage, search]);

  const handleDownload = () => {
    html2pdf()
      .set({
        margin: 0,
        filename: `inventory_${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
      })
      .from(tableRef.current)
      .save();
  };

  return (
    <div className="data-table-container">
      <div className="data-table">
        {/* Header */}
        <div className="table-header">

         

          <div className="table-search-wrapper">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search inventory"
              className="table-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={() => fetchInventories({ search })}
            />
          </div>


           <BulkActionBar
            selectedCount={selectedIds.length}
            onClear={clearSelection}
            actions={[
              {
                value: "delete",
                label: `Delete (${selectedIds.length})`,
                onClick: async () => {
                  try {
                    await bulkDeleteInventories(selectedIds);
                    clearSelection();
                    fetchInventories();
                  } catch (err) {
                    console.error(err);
                  }
                },
              },
            ]}
          />

          <div className="table-buttons">
            <button  className="emerald-btn" onClick={() => navigate(`/inventory/add`)}>
              <AddIcon   fontSize="small" /> Add Inventory
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
                <th>Item No</th>
                <th>Item Name</th>
                <th>Stock</th>
                <th>Remaining Stock</th>
                <th>Sold Stock</th>
               {isDesktopUp && <th>Item Batch</th> }
                
               {isTablet &&   <th>Stock Value</th>}
                 {isDesktopUp &&   <th>Expiry</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11">Loading...</td>
                </tr>
              ) : (
                inventories.map((inv, index) => (
                  <tr key={inv.id}>
                      <td>
  <input
    type="checkbox"
    checked={selectedIds.includes(inv.id)}
    onChange={() => toggleSelectOne(inv.id)}
  />
</td>
                    <td>{index + 1}</td>
                    <td>{inv.item?.item_no || "-"}</td>
                    <td>{truncateText(inv.item?.item_name || "-",16)}</td>
                    <td>{inv.gross_stock}</td>
                    <td>{inv.qty}</td>
                    <td>{inv.sold_qty}</td>
                    
                  {isDesktopUp &&  <td>{truncateText(inv.item?.batchNumber,18)}</td>}
                    {isTablet &&  <td>{inv.totalValue.toFixed(2)}</td>}
                   {isDesktopUp &&   <td>{inv.item?.expiryDate}</td>}
                    <td className="action-icons">
                     <EditIcon
  fontSize="small"
  style={{ cursor: "pointer" }}
  onClick={() => navigate(`/inventory/edit/${inv.id}`)}
/>
                    {isDesktopUp &&  <DeleteOutlineIcon
                        fontSize="small"
                        onClick={() => {
                          setActiveInventory(inv);
                          setShowDeleteModal(true);
                        }}
                      /> }
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
          <div className="table-info">
            Showing {inventories.length} items in inventory
          </div>
        </div>

        {/* Modals */}
        {/* {showAddModal && (
          <AddInventoryForm
            onClose={() => setShowAddModal(false)}
            itemsList={items}
          />
        )}
        // {showEditModal && (
        //   <EditInventoryForm
        //     inventory={activeInventory}
        //     onClose={() => setShowEditModal(false)}
        //     itemsList={items}
        //   />
        // )} */}
        {showDeleteModal && (
          <DeleteInventoryConfirm
            inventory={activeInventory}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
}
