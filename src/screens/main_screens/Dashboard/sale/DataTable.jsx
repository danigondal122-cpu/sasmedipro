import React, { useEffect, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Pagination from "../../../../components/Pagination.jsx";
import AddSaleForm from "./AddSaleForm.jsx";
import EditSaleForm from "./EditSaleForm.jsx";
import DeleteSaleConfirm from "./DeleteSaleConfirm.jsx";
import html2pdf from "html2pdf.js";
import { useSales } from "../../../../contexts/SaleContext";
import ReactDOMServer from 'react-dom/server';
import InvoicePDF from "./components/invoice/InvoicePDF.jsx"; // Import your InvoicePDF component
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PrintIcon from "@mui/icons-material/Print";
import { useCompanySettings } from "../../../../contexts/company_setting_context";
import FilterBar from "../../../../components/FilterBar.jsx";
import BulkActionBar from "../../../../components/BulkActionBar";
import { useBulkSelection } from "../../../../hooks/useBulkSelection";
import useResponsive from "../../../../hooks/useResponsive.js";
import useRecordHover from "../../../../hooks/useRecordHover.js";
import HoverInsightCard from "../../../../components/HoverInsightCard.jsx";
import { PaymentStatusLabel } from "../../../../common/enum/paymentStatusEnum.js";

import { truncateText, formatDateShort } from "../../../../heplers/textHelpers";

export default function SaleDataTable() {
  const { sales, fetchSales, loading, meta, bulkDeleteSales, bulkUpdateStatus, } = useSales();
   const { settings: companySettings, fetchSettings } = useCompanySettings();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeSale, setActiveSale] = useState(null);

  const {
 hoveredItem,
  position,
  handleMouseEnter,
  handleMouseMove,
  handleMouseLeave
} = useRecordHover();

  const { isMobile,isSmallMobile, isTablet, isLargeDesktop, isDesktop,isDesktopUp } = useResponsive();



  


  

  const tableRef = useRef();
  const navigate=useNavigate();

  useEffect(() => {
   
    fetchSales({ search, page: currentPage });
  }, [currentPage, search]);

 

   const handleDownload = async(sale) => {

      let company = companySettings;
    if (!company.name) {
      company = await fetchSettings();
      if (!company) return;
    }

    const pdfContent = ReactDOMServer.renderToString(
      <InvoicePDF data={sale} company={company} />
    );
    // Pass the sale data to InvoicePDF for generating the PDF
 

    html2pdf()
      .set({
        margin: 0,
        filename: `sales_invoice_${sale.invoiceNo}.pdf`, // Unique filename per sale
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
      })
      .from(pdfContent)  // Pass the InvoicePDF JSX component here
      .save();
  };




  const handlePrint = async (sale) => {
  let company = companySettings;

  if (!company.name) {
    company = await fetchSettings();
    if (!company) return;
  }

  const pdfContent = ReactDOMServer.renderToString(
    <InvoicePDF data={sale} company={company} />
  );

  const opt = {
    margin: 0,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
  };

  const worker = html2pdf().set(opt).from(pdfContent);

  const pdfBlob = await worker.outputPdf("blob");
  const blobUrl = URL.createObjectURL(pdfBlob);

  const printWindow = window.open(blobUrl);

  printWindow.onload = function () {
    printWindow.focus();
    printWindow.print();
  };
};



  const {
  selectedIds,
  isAllSelected,
  toggleSelectAll,
  toggleSelectOne,
  clearSelection,
} = useBulkSelection(sales);


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
      value: "confirmed",
      label: `Mark Confirmed (${selectedIds.length})`,
      onClick: async () => {
        await bulkUpdateStatus(selectedIds, "confirmed");
        clearSelection();
        fetchSales();
      },
    },
    {
      value: "delivered",
      label: `Mark Delivered (${selectedIds.length})`,
      onClick: async () => {
        await bulkUpdateStatus(selectedIds, "delivered");
        clearSelection();
        fetchSales();
      },
    },
    {
      value: "cancelled",
      label: `Mark Cancelled (${selectedIds.length})`,
      onClick: async () => {
        await bulkUpdateStatus(selectedIds, "cancelled");
        clearSelection();
        fetchSales();
      },
    },
    {
      value: "delete",
      label: `Delete (${selectedIds.length})`,
      onClick: async () => {
        await bulkDeleteSales(selectedIds);
        clearSelection();
        fetchSales();
      },
    },
  ]}
/>




          <FilterBar
  filters={[
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "credit", label: "Credit" },
    { value: "card", label: "Card" },
  ]}
  onFilter={(paymentType) => {
    // refetch sales with filter
    fetchSales({ search, page: currentPage, payment_type: paymentType });
  }}
/>

        


            <div className="table-search-wrapper">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search sales..."
              className="table-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // onKeyUp={() => fetchItems({ search })}
            />
          </div>

          <div className="table-buttons">
            <button className="emerald-btn" onClick={() => navigate(`/sales/add`)}>
              <AddIcon fontSize="small" /> Add Sale
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
              <tr 
             
             
              >
                <th>
  <input
    type="checkbox"
    checked={isAllSelected}
    onChange={toggleSelectAll}
  />
</th>
                <th>#</th>
                <th>Invoice No</th>
              {!isSmallMobile &&     <th>Customer</th>}
                {!isMobile &&  <th>Total Amount</th>}
                {!isMobile &&  <th>Status</th>}
              {isLargeDesktop  && <th>Sales Person</th>}
{isLargeDesktop  && <th>Payment Type</th>}
{isLargeDesktop  && <th>WHs</th>}
{isLargeDesktop  && <th>UOM</th>}
              {isDesktopUp && <th>Items Count</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12">Loading...</td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan="12">No sales found</td>
                </tr>
              ) : (
                sales.map((sale, index) => (
                  <tr key={sale.id} 

                
   onMouseEnter={() => handleMouseEnter(sale)}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
                   style={{
    backgroundColor:
      sale.payment_status === "paid"
        ? "#d4edda"   // light green
        : sale.payment_status === "unpaid"
        ? "#f8d7da"   // light red
        : "transparent",
  }}
  >
                    <td>
  <input
    type="checkbox"
    checked={selectedIds.includes(sale.id)}
    onChange={() => toggleSelectOne(sale.id)}
  />
</td>
                    <td>{(meta.current_page - 1) * meta.per_page + index + 1}</td>
                    <td>{sale.invoiceNo}</td>
                   {!isSmallMobile &&   <td>{truncateText(sale.customer?.name,16)}</td>}
                 {!isMobile &&  <td>{sale.total.toFixed(2)}</td>}
                    {!isMobile &&  <td>{sale.status}</td> }
                   {isLargeDesktop  && <td>{truncateText(sale.seller?.name ,16)}</td>}
{isLargeDesktop  && <td>{sale.paymentType}</td>}
{isLargeDesktop  && <td>{truncateText(sale.whs,14)}</td>}
{isLargeDesktop  && <td>{truncateText(sale.uom,14)}</td>}
                  {isDesktopUp &&  <td>{sale.items.length}</td> }
                    <td className="action-icons">

                       <PrintIcon
    fontSize="small"
    onClick={() => handlePrint(sale)}
  />

                       <DownloadOutlinedIcon
                        fontSize="small"
                        onClick={() => handleDownload(sale)}  // Trigger PDF download for this sale
                      />


                     <EditIcon onClick={() => navigate(`/sales/edit/${sale.id}`)} />

                  {isDesktopUp &&  <DeleteOutlineIcon
                        fontSize="small"
                        onClick={() => {
                          setActiveSale(sale);
                          setShowDeleteModal(true);
                        }}
                      /> }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
         
<HoverInsightCard
  item={hoveredItem}
  position={position}
  title={(sale) => `Invoice #${sale.invoiceNo}`}
  fields={[
    {
      label: "Customer",
      value: (sale) => sale.customer?.name
    },
    {
      label: "Total",
      value: (sale) => sale.total
    },
    {
      label: "Status",
      value: (sale) => sale.status
    },
    {
      label: "Payment",
      value: (sale) => PaymentStatusLabel[sale.payment_status]
    },
    {
      label: "Items",
      value: (sale) => sale.items.length
    }
  ]}
/>
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
            Showing {sales.length} sales
          </div>
        </div>

        {/* Modals */}
        {/* {showAddModal && <AddSaleForm onClose={() => setShowAddModal(false)} />} */}
        {/* {showEditModal && activeSale && (
          <EditSaleForm sale={activeSale} onClose={() => setShowEditModal(false)} />
        )} */}
        {showDeleteModal && activeSale && (
          <DeleteSaleConfirm sale={activeSale} onClose={() => setShowDeleteModal(false)} />
        )}
      </div>
    </div>
  );
}

