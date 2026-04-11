import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferIcon from "@mui/icons-material/LocalOfferOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import { RouteName } from "../routes/routes_name";
import logoImg from "../assets/images/logo.jpeg";
import { useLogin } from "../contexts/login_context";
import { hasPermission } from "../heplers/permissions_helper";

import AccountBalanceIcon from "@mui/icons-material/AccountBalanceOutlined";



export default function Sidebar({ isOpen,closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useLogin();
  const [openMenu, setOpenMenu] = useState(null);


    useEffect(() => {
    if (!user?.permissions || !Array.isArray(user?.permissions)) {
      navigate("/login"); // Replace with your login route
    }
  }, [user, navigate]);

  // Automatically set openMenu based on current location
 useEffect(() => {
  if (!isOpen) return;

  const findOpenMenu = (items) => {
    for (const item of items) {
      if (item.path === location.pathname) return item.name;

      if (item.children) {
        const childOpen = findOpenMenu(item.children);
        if (childOpen) return item.name;
      }
    }
    return null;
  };

  const activeMenu = findOpenMenu(menuItems);
  setOpenMenu(activeMenu);
}, [location.pathname, isOpen]);



  const menuItems = [
  {
      name: "Dashboard",
      icon: <DashboardIcon />,
      path: RouteName.dashboard,
      
    },

  {
    name: "Customers",
    icon: <PeopleIcon />,
    children: [
      { name: "All Customers", path: RouteName.customers, permissions: ["backend.customer.index"] },
      { name: "Add Customer", path: RouteName.addCustomers, permissions: ["backend.customer.create"] },
    ],
  },

  {
    name: "Sales",
    icon: <LocalOfferIcon />,
    children: [
      { name: "Sales Overview", path: RouteName.sales_overview, permissions: ["backend.sale.index"] },
      { name: "Sales List", path: RouteName.sales, permissions: ["backend.sale.index"] },
      { name: "Add Sale", path: RouteName.addSale, permissions: ["backend.sale.create"] },
    ],
  },

  {
    name: "Store",
    icon: <ShoppingCartIcon />,
    children: [
      {
        name: "Items",
        icon: <ShoppingBagIcon />,
        children: [
          { name: "All Items", path: RouteName.items, permissions: ["backend.item.index"] },
          { name: "Add Item", path: RouteName.addItem, permissions: ["backend.item.create"] },
        ],
      },
      {
        name: "Purchase",
        icon: <ShoppingCartIcon />,
        children: [
          { name: "Purchase List", path: RouteName.purchase, permissions: ["backend.purchase.index"] },
          { name: "Add Purchase", path: "/purchase/add", permissions: ["backend.purchase.create"] },
        ],
      },
      {
        name: "Inventory",
        icon: <InventoryIcon />,
        children: [
          { name: "Inventory List", path: "/inventory", permissions: ["backend.inventory.index"] },
          { name: "Add Inventory", path: "/inventory/add", permissions: ["backend.inventory.create"] },
        ],
      },
    ],
  },
   {
    name: "Delivery",   // 🔹 New Delivery Module
    icon: <ShoppingCartIcon />,
    children: [
      { name: "All Deliveries", path: "/delivery" }, // No permission required
      // { name: "Add Delivery", path: "/delivery/add" }, // No permission required
    ],
  },

  {
  name: "Loans",
  icon: <AccountBalanceIcon />,
  children: [
    { 
      name: "All Loans", 
      path: "/loans", 
     // permissions: ["backend.loan.index"] 
    },
    { 
      name: "Add Loan", 
      path: "/loans/add", 
    //  permissions: ["backend.loan.create"] 
    }
  ],
},


  {
    name: "Users",
    icon: <PeopleIcon />,
    permissions: ["backend.user.index"], // top-level permission
    children: [
      { name: "All Users", path: "/users", permissions: ["backend.user.index"] },
      { name: "Add User", path: "/users/add", permissions: ["backend.user.create"] },
      {
        name: "Roles",
        icon: <SettingsIcon />,
        children: [
          { name: "All Roles", path: "/roles", permissions: ["backend.role.index"] },
          { name: "Role Management", path: "/roles/permissions", permissions: ["backend.role.index"] },
          { name: "Add Role", path: "/roles/add", permissions: ["backend.role.create"] },
        ],
      },
    ],
  },

  {
    name: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
    permissions: ["backend.setting.index"],
  },
];


const isMenuItemVisible = (item, userPermissions) => {
  // Check if user has permission for this item
  const hasPerm = !item.permissions || hasPermission(userPermissions, item.permissions);

  // Recursively filter children
  const visibleChildren = item.children?.filter((child) =>
    isMenuItemVisible(child, userPermissions)
  );

  // Show item if user has permission OR at least one child is visible
  return hasPerm || (visibleChildren && visibleChildren.length > 0);
};
const renderSubMenu = (children, isSecondLayer = false) =>
  children
    .filter((child) => isMenuItemVisible(child, user.permissions)) // filter inaccessible children
    .map((child) => {
      const isChildActive =
        child.path === location.pathname ||
        child.children?.some((sub) => sub.path === location.pathname);

      return (
        <li key={child.name}>
          {child.path ? (
            <div
              className={`submenu-item ${isChildActive ? "active" : ""} ${
                isSecondLayer ? "second-layer" : ""
              }`}
              onClick={() => {
  navigate(child.path);
  closeSidebar();   // 👈 close after selecting
}}
            >
              {child.icon && React.cloneElement(child.icon, { sx: { fontSize: 20, marginRight: 10 } })}
              {child.name}
            </div>
          ) : (
            <>
              <div
                className={`submenu-item ${isChildActive ? "active" : ""} ${
                  isSecondLayer ? "second-layer" : ""
                }`}
              >
                {child.icon && React.cloneElement(child.icon, { sx: { fontSize: 20, marginRight: 2 } })}
                {child.name}
              </div>
              {child.children && (
                <ul className="submenu">{renderSubMenu(child.children, true)}</ul>
              )}
            </>
          )}
        </li>
      );
    });

  const visibleMenuItems = menuItems.filter((item) => isMenuItemVisible(item, user?.permissions));

  return (
    <aside className="sidebar">
      <div className="sidebar_logo">
        <img src={logoImg} alt="Logo" className="sidebar_logo_image" />
      </div>

      <nav className="menu">
        <h2 className="menu-category">Main Menu</h2>
       <ul>
  {visibleMenuItems.map((item) => {
    const isActive =
      item.path === location.pathname ||
      item.children?.some((child) =>
        child.path === location.pathname ||
        child.children?.some((sub) => sub.path === location.pathname)
      );

    const isOpen = openMenu === item.name;

    return (
      <li key={item.name}>
        <div
          className={`menu-item ${isActive ? "active" : ""}`}
         onClick={() => {
  if (item.children) {
    setOpenMenu(isOpen ? null : item.name);
  } else {
    navigate(item.path);
    closeSidebar();   // 👈 close sidebar
  }
}}
        >
          {React.cloneElement(item.icon, {
            sx: { fontSize: 26, color: isActive ? "#fff" : undefined },
          })}
          <span>{item.name}</span>
        </div>
        {item.children && isOpen && <ul className="submenu">{renderSubMenu(item.children)}</ul>}
      </li>
    );
  })}
</ul>
      </nav>
    </aside>
  );
}
