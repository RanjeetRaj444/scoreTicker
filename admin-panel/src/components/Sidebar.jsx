import { Divider, Tooltip, Drawer, Popconfirm } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeFilled,
  PlusCircleFilled,
  TrophyFilled,
  UserAddOutlined,
  EnvironmentOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  FileTextFilled,
  DollarCircleFilled,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileVisible(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <HomeFilled /> },
    {
      path: "/create-match",
      label: "Create Match",
      icon: <PlusCircleFilled />,
    },
    { path: "/create-venue", label: "Venues", icon: <EnvironmentOutlined /> },
    { path: "/create-player", label: "Players", icon: <UserAddOutlined /> },
    { path: "/articles", label: "Articles", icon: <FileTextFilled /> },
    { path: "/ads", label: "Ads", icon: <DollarCircleFilled /> },
  ];

  if (user?.role === "SUPER_ADMIN" || user?.role === "TECH_ADMIN") {
    menuItems.push({
      path: "/users",
      label: "Users",
      icon: <SettingOutlined />,
    });
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 flex items-center justify-between">
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-xl shadow-lg ring-4 ring-zinc-50">
              🏏
            </div>
            <h1 className="text-xl font-black tracking-tighter text-zinc-900 uppercase italic">
              Score<span className="text-orange-500">TKR</span>
            </h1>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-zinc-50 text-zinc-400 hover:text-zinc-900 flex items-center justify-center transition-colors"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        )}
      </div>

      <div className="px-4 py-2 flex-1 overflow-y-auto no-scrollbar">
        {(!collapsed || isMobile) && (
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 px-2">
            Main Menu
          </p>
        )}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setMobileVisible(false)}
            >
              <div
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                  location.pathname === item.path
                    ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/10"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <span
                  className={`text-lg ${location.pathname === item.path ? "text-orange-500" : "group-hover:text-orange-500"}`}
                >
                  {item.icon}
                </span>
                {(!collapsed || isMobile) && (
                  <span className="font-bold text-sm tracking-tight">
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-100 italic">
        {user && (!collapsed || isMobile) && (
          <div className="px-4 py-3 mb-2">
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">
              User
            </p>
            <p className="text-sm font-bold text-zinc-900 truncate">
              {user.fullName}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
              {user.role}
            </p>
          </div>
        )}
        <Popconfirm
          title="Logout"
          description="Are you sure you want to logout?"
          onConfirm={handleLogout}
          okText="Yes"
          cancelText="No"
        >
          <div
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all cursor-pointer`}
          >
            <span className="text-lg text-red-500">
              <LogoutOutlined />
            </span>
            {(!collapsed || isMobile) && (
              <span className="font-bold text-sm tracking-tight">Logout</span>
            )}
          </div>
        </Popconfirm>
      </div>
    </div>
  );
  // ... rest of the component ...

  if (isMobile) {
    return (
      <>
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-sm shadow-md">
              🏏
            </div>
            <h1 className="text-lg font-black tracking-tighter text-zinc-900 uppercase italic">
              Score<span className="text-orange-500">TKR</span>
            </h1>
          </div>
          <button
            onClick={() => setMobileVisible(true)}
            className="text-zinc-900 text-2xl"
          >
            <MenuUnfoldOutlined />
          </button>
        </div>
        <Drawer
          placement="left"
          onClose={() => setMobileVisible(false)}
          open={mobileVisible}
          bodyStyle={{ padding: 0 }}
          width={280}
          closable={false}
        >
          <SidebarContent />
        </Drawer>
      </>
    );
  }

  return (
    <div
      className={`h-screen sticky top-0 bg-white border-r border-zinc-100 transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-72"
      } shadow-[20px_0_40px_-20px_rgba(0,0,0,0.03)]`}
    >
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
