import React, { useState, useEffect } from "react";
import { useCustomers } from "../../../../contexts/CustomerContext";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Pagination from "../../../../components/Pagination.jsx";
import DeleteCustomerModal from "./DeleteCustomerModal";
import useResponsive from "../../../../hooks/useResponsive.js";
import { truncateText, formatDateShort } from "../../../../heplers/textHelpers";

export default function CustomerDataTable() {
  const navigate = useNavigate();
  const { customers, fetchCustomers, loading, meta } = useCustomers();
 const [customerToDelete, setCustomerToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {isTablet,isSmallMobile,isMobile,isDesktop,isLargeDesktop,isDesktopUp}=useResponsive()

  useEffect(() => {
    fetchCustomers({ search, page: currentPage });
  }, [search, currentPage]);

  return (
    <div className="data-table-container">
     
      <div className="data-table">

        {/* Header */}
        <div className="table-header">
          <div className="table-search-wrapper">
                     <SearchOutlinedIcon className="search-icon" />
                     <input
                       type="text"
                       placeholder="Search Customers"
                       className="table-search"
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                      //  onKeyUp={() => fetchItems({ search })}
                     />
                   </div>
         

          <button className="emerald-btn" onClick={() => navigate("/customers/add")}>
            <AddIcon /> Add Customer
          </button>
        </div>



         <div className="table-wrapper">

        {/* Table */}
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer No</th>
              <th>Name</th>
                {!isSmallMobile &&    <th>Email</th>}
             {(!isMobile || !isSmallMobile) &&  <th>Address</th>}
           {isDesktopUp && <th>Phone</th>}

             {isDesktopUp && <th>Mobile</th>}
            {isLargeDesktop &&<th>VAT</th> }
            {isLargeDesktop &&  <th>BRN</th>}
            
             {!isSmallMobile &&   <th>Role</th>}
              <th>Action</th>

              
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="11">Loading...</td></tr>
            ) : (
              customers.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>{c.customerNo}</td>
                  <td>{truncateText(c.name,16)}</td>
                {!isSmallMobile &&   <td>{truncateText(c.email,16)}</td>}
                  {(!isMobile || !isSmallMobile) && <td>{truncateText(c.address,15)}</td>}
             {isDesktopUp && <td>{truncateText(c.phone,9)}</td>}
               {isDesktopUp &&  <td>{truncateText(c.mobile,9)}</td>}
                  {isLargeDesktop && <td>{truncateText(c.vat,9)}</td>}
                 {isLargeDesktop &&  <td>{truncateText(c.brn,9)}</td>}
                  {!isSmallMobile &&  <td>{c.role}</td>}
                  <td className="action-icons">
                    <EditIcon fontSize="small" onClick={() => navigate(`/customers/edit/${c.id}`)} />
                   <DeleteOutlineIcon
  fontSize="small"
  style={{ cursor: "pointer" }}
  onClick={() => setCustomerToDelete(c)}
/>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>


        {customerToDelete && (
  <DeleteCustomerModal
    customer={customerToDelete}
    onClose={() => setCustomerToDelete(null)}
  />
)}

        {/* Pagination */}
        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={setCurrentPage}
        />

      </div>
    </div>
  );
}
