import React, { useState, useEffect } from "react";
import { useUserAccounts } from "../../../../contexts/UserAccountContext";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Pagination from "../../../../components/Pagination.jsx";
import DeleteUserAccountModal from "./DeleteUserAccountModal.jsx";
import useResponsive from "../../../../hooks/useResponsive.js";
import { truncateText, formatDateShort } from "../../../../heplers/textHelpers";
//import DeleteUserModal from "./DeleteUserModal"; // Create this modal similar to DeleteCustomerModal

export default function UserAccountDataTable() {
  const navigate = useNavigate();
  const { accounts, fetchAccounts, loading, meta } = useUserAccounts();
  const [userToDelete, setUserToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {isSmallMobile, isMobile} = useResponsive()

  useEffect(() => {
    fetchAccounts({ search, page: currentPage });
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
              placeholder="Search Users"
              className="table-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="emerald-btn" onClick={() => navigate("/users/add")}>
            <AddIcon /> Add User
          </button>
        </div>

        {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
             {(!isSmallMobile && !isMobile) && <th>Created At</th>}
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6">Loading...</td></tr>
            ) : (
              accounts.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.name}</td>
                  <td> {truncateText(u.email, 16)}</td>
                  <td>{u.role.label}</td>
                  {(!isSmallMobile && !isMobile) &&  <td>{formatDateShort(u.createdAt)}</td>}
                  <td className="action-icons">
                    <EditIcon
                      fontSize="small"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/users/edit/${u.id}`)}
                    />
                    <DeleteOutlineIcon
                      fontSize="small"
                      style={{ cursor: "pointer", marginLeft: "5px" }}
                      onClick={() => setUserToDelete(u)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {/* Delete Modal */}
        {userToDelete && (
          <DeleteUserAccountModal
            user={userToDelete}
            onClose={() => setUserToDelete(null)}
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
