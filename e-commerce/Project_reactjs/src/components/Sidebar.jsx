import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Sidebar.css";
import { getProfileUser } from "../store/ProfileUser";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [

    { id: "dashboard", label: "📊 Dashboard", path: "/dashboard" },

    {
      id: "products",
      label: "📦 Product Management",
      path: "/products",
      submenu: [
        { id: "brand", label: "Brand", path: "/brand" },
        { id: "list-product", label: "Product List", path: "/products" },
        { id: "categories", label: "Categories", path: "/category" },
      ],
    },

    {
      id: "sales",
      label: "💳 Point of Sale",
      path: "/salespos",
      submenu: [
        { id: "new-sale", label: "New Sale", path: "/salepos" },
        { id: "sales-list", label: "Sales History", path: "/salehistory" },
      ],
    },

    { id: "customers", label: "👥 Customers", path: "/customers" },

    {
      id: "reports",
      label: "📈 Reports",
      path: "/reports",
      submenu: [
        { id: "sales-report", label: "Sales Report", path: "/sales" },
        {
          id: "inventory-report",
          label: "Inventory Report",
          path: "/inventory",
        },
        {
          id: "customer-report",
          label: "Customer Report",
          path: "/customer",
        },
      ],
    },

    {
      id: "settings",
      label: "⚙️ Settings",
      path: "/settings",
      submenu: [
        { id: "role", label: "Roles", path: "/role" },
        {
          id: "user-management",
          label: "User",
          path: "/manageuser",
        },
        {
          id: "role-permission",
          label: "Permission",
          path: "/permission",
        },
        {
          id: "low-stock-alert",
          label: "Low Stock Alert",
          path: "/lowstockalert",
        },
      ],
    },

    {
      id: "expense",
      label: "💵 Expense",
      path: "/expense",
    },

    {
      id: "inventory",
      label: "📦 Inventory",
      path: "/inventory",
    },
    {
      id: "index",
      label: "🌐 View Website",
      path: "/index",
    },
  ];

  const [items, setItems] = useState(menuItems);
  const profileUser = getProfileUser();
  const roles = profileUser?.roles ? (Array.isArray(profileUser.roles) ? profileUser.roles : [profileUser.roles]) : [];
  const permissions = roles.flatMap((role) => {
    if (!role) return [];
    if (Array.isArray(role.permissions)) return role.permissions;
    return role.permissions ? [role.permissions] : [];
  });

  useEffect(() => {
    renderPermission();
  }, [permissions.length]);

  const hasPermissionForPath = (path) =>
    permissions.some((perm) => {
      const value = perm?.description;
      return value && (path === `/${value}` || path === value);
    });

  const renderPermission = () => {
    if (!permissions || permissions.length === 0) {
      setItems(menuItems);
      return;
    }

    const allowedMenu = [];

    menuItems.forEach((item) => {
      const hasTopLevelPermission = hasPermissionForPath(item.path);

      const allowedSubmenu = item.submenu?.filter((subitem) =>
        hasPermissionForPath(subitem.path),
      );
      if (hasTopLevelPermission) {
        allowedMenu.push(item);
      } else if (allowedSubmenu && allowedSubmenu.length > 0) {
        allowedMenu.push({ ...item, submenu: allowedSubmenu });
      }
    });

    setItems(allowedMenu);
  };



  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSubmenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>CAFE MANAGEMENT</h2>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <div key={item.id} className="nav-item-wrapper">
            <button
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => {
                if (item.submenu) {
                  toggleSubmenu(item.id);
                } else {
                  handleNavigation(item.path);
                }
              }}
            >
              <span>{item.label}</span>
              {item.submenu && (
                <span
                  className={`submenu-toggle ${expandedMenu === item.id ? "open" : ""}`}
                >
                  ▼
                </span>
              )}
            </button>

            {item.submenu && expandedMenu === item.id && (
              <div className="submenu">
                {item.submenu.map((subitem) => (
                  <button
                    key={subitem.id}
                    className={`submenu-item ${
                      location.pathname === subitem.path ? "active" : ""
                    }`}
                    onClick={() => handleNavigation(subitem.path)}
                  >
                    {subitem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
