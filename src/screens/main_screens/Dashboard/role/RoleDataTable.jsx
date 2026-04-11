import React, { useEffect } from "react";
import { useRoles } from "../../../../contexts/RoleContext";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function RoleDataTable() {
  const navigate = useNavigate();
  const { roles, fetchRoles, loading } = useRoles();

  useEffect(() => {
   fetchRoles();
  }, []);

  return (
    <div className="data-table-container">
      <div className="data-table">

        <div className="table-header">
          <button
            className="emerald-btn"
            onClick={() => navigate("/roles/add")}
          >
            <AddIcon /> Add Role
          </button>
        </div>



        <div className="table-wrapper">
        <table className="table">
       
          <thead>
            <tr>
              <th>#</th>
              <th>Role Name</th>
              <th>Permissions Count</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="4">Loading...</td></tr>
            ) : (
              roles.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{r.label}</td>
                  <td>{r.permissions.length}</td>
                  <td>
                    <EditIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/roles/permissions`)}
                    />
                    <DeleteOutlineIcon
                      style={{ cursor: "pointer", marginLeft: 5 }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
         
        </table>
         </div>
        

      </div>
    </div>
  );
}
