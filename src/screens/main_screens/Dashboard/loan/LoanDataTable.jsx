import React, { useState, useEffect, useRef } from "react";
import { useLoans } from "../../../../contexts/LoanContext.jsx";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../components/Pagination.jsx";
import html2pdf from "html2pdf.js";
import ReactDOMServer from "react-dom/server";
//import InvoicePDF from "./components/invoice/LoanInvoicePDF.jsx";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LoanDeleteConfirm from "./LoanDeleteConfirm.jsx";
import { useBulkSelection } from "../../../../hooks/useBulkSelection.js";
import BulkActionBar from "../../../../components/BulkActionBar";
import useResponsive from "../../../../hooks/useResponsive.js";

export default function LoanDataTable() {
  const { loans, fetchLoans, loading, meta,bulkDeleteLoans } = useLoans();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  
    const { isMobile,isSmallMobile, isTablet, isLargeDesktop, isDesktop,isDesktopUp } = useResponsive();
  


    const {
      selectedIds,
      isAllSelected,
      toggleSelectAll,
      toggleSelectOne,
      clearSelection,
    } = useBulkSelection(loans);

const [activeLoan, setActiveLoan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans({ search, page: currentPage });
  }, [search, currentPage]);

//   const handleDownload = async (loan) => {
//     const pdfContent = ReactDOMServer.renderToString(<InvoicePDF data={loan} />);
//     html2pdf()
//       .set({ margin: 0, filename: `loan_${loan.loanNo}.pdf`, html2canvas: { scale: 3 }, jsPDF: { unit: "px", format: [794, 1123] } })
//       .from(pdfContent)
//       .save();
//   };

  return (
    <div className="data-table-container">
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
                           await bulkDeleteLoans(selectedIds)
                            clearSelection();
                            fetchLoans();
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
              placeholder="Search loans..."
              className="table-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // onKeyUp={() => fetchItems({ search })}
            />
          </div>
        <div className="table-buttons">
          <button className="emerald-btn" onClick={() => navigate("/loans/add")}>
            <AddIcon fontSize="small" /> Add Loan
          </button>
        </div>
      </div>

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
            <th>Loan No</th>
            <th>Lender</th>
          {!isSmallMobile &&     <th>Borrower</th>}
          {!isMobile &&     <th>Principal</th>}
           {isDesktopUp && <th>Interest Rate</th>}
           {isDesktopUp && <th>Total Repayment</th>}
           {!isMobile &&    <th>Total Due</th>}
           {isDesktopUp &&  <th>Remaining</th> }
           {isLargeDesktop && <th>Status</th>}
           {!isSmallMobile &&    <th>Repayments</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="12">Loading...</td></tr>
          ) : loans.length === 0 ? (
            <tr><td colSpan="12">No loans found</td></tr>
          ) : (
            loans.map((loan, i) => (
              <tr key={loan.id}>
                   <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(loan.id)}
                          onChange={() => toggleSelectOne(loan.id)}
                        />
                      </td>
                <td>{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                <td>{loan.loanNo}</td>
                <td>{loan.lender_name}</td>
               {!isSmallMobile &&    <td>{loan.borrower_name}</td>}
              {!isMobile &&     <td>{loan.principal}</td>}
             {isDesktopUp &&   <td>{loan.interestRate}%</td>}
             {isDesktopUp &&   <td>{loan.totalRepayment}</td>}
             {!isMobile &&      <td>{loan.totalDue}</td>}
             {isDesktopUp  &&    <td>{loan.remainingBalance}</td> }
             {isLargeDesktop &&   <td>{loan.status}</td>}
              {!isSmallMobile &&     <td>{loan.repayments.length}</td> }
                <td className="action-icons">

                    <DownloadOutlinedIcon
  onClick={() => navigate(`/loans/${loan.id}/repayments`)}
/>
                 
                    <AddIcon onClick={() => navigate(`/loans/${loan.id}/repayments/add`)} />
                  <EditIcon onClick={() => navigate(`/loans/edit/${loan.id}`)} />
               {isDesktopUp  &&  <DeleteOutlineIcon
  onClick={() => {
    setActiveLoan(loan);
    setShowDeleteModal(true);
  }}
/> }
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showDeleteModal && activeLoan && (
  <LoanDeleteConfirm
    loan={activeLoan}
    onClose={() => setShowDeleteModal(false)}
  />
)}

      <Pagination currentPage={meta.current_page} totalPages={meta.last_page} onPageChange={setCurrentPage} />
    </div>
  );
}