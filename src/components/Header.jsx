// src/components/TopHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloseIcon from '@mui/icons-material/Close'; 
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useLogin } from "../contexts/login_context";
import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar, isSidebarOpen  }) {
  const { logout,user } = useLogin();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);

  const navigate=useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="top-header">
      {/* Left */}
      <div className="header-left">
       {isSidebarOpen ? (
          <CloseIcon
            onClick={toggleSidebar}
            sx={{ fontSize: 34 }}
            className="menu-bars-icon clickable"
          />
        ) : (
          <MenuIcon
            onClick={toggleSidebar}
            sx={{ fontSize: 34 }}
            className="menu-bars-icon clickable"
          />
        )}
        {/* <span className="page-list-text">Page List</span> */}
      </div>

      {/* Center */}
      <div className="header-center">
        <div className="search-wrapper">
          <SearchOutlinedIcon className="search-icon" />
          <input type="text" placeholder="Search..." className="header-search" />
        </div>
      </div>

      {/* Right */}
      <div className="header-right">
        <NotificationsNoneIcon sx={{ fontSize: 34 }} className="header-icon notifications" />
        <SettingsOutlinedIcon onClick={() => navigate(`/settings`)} sx={{ fontSize: 34 }} className="header-icon" />

        {/* Profile */}
        <div className="profile" ref={dropdownRef}>
          <AccountCircleIcon
            sx={{ fontSize: 34 }}
            className="header-icon clickable"
            onClick={() => setShowDropdown(!showDropdown)}
          />

        <div className="profile-info">
           <span className="profile-name">{user?.name || "Guest"}</span>
           <span className="profile-name">{user?.roleLabel || ""}</span>
</div>
          {/* Dropdown */}
          {showDropdown && (
            <div className="profile-dropdown">
              <button onClick={() => setShowModal(true)}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Do you want to logout?</h3>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                No
              </button>
              <button className="btn-logout" onClick={logout}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
