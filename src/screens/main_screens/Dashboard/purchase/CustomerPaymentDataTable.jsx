import React, { useEffect, useState, useRef } from "react";
import Pagination from "../../../../components/Pagination.jsx";
import { useCustomerPayments } from "../../../../contexts/CustomerPaymentContext";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function CustomerPaymentDataTable() {
  const { payments, fetchPayments, loading, meta } = useCustomerPayments();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchCustomer, setSearchCustomer] = useState("");
  const tableRef = useRef();

  useEffect(() => {
    fetchPayments({ page: currentPage, customer_id: searchCustomer });
  }, [currentPage, searchCustomer]);

  return (
    <div className="data-table-container">
      <div className="data-table">
        
        {/* Header */}
        <div className="table-header">
          <div className="table-search-wrapper">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search payments..."
              className="table-search"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div ref={tableRef}>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice No</th>
                <th>Amount Paid</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="4">No payments found</td>
                </tr>
              ) : (
                payments.map((p, index) => (
                  <tr key={p.id}>
                    <td>{(meta.current_page - 1) * meta.per_page + index + 1}</td>
                    <td>{p.sale?.invoiceNo || "-"}</td>
                    <td>{p.amountPaid.toFixed(2)}</td>
                    <td>{p.paidAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="table-footer">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onPageChange={(page) => setCurrentPage(page)}
          />

          <div className="table-info">
            Showing {payments.length} payments
          </div>
        </div>

      </div>
    </div>
  );
}
