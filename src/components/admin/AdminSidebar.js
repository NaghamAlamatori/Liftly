import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Tag, FileText } from "lucide-react";
import { siteImage } from "../../lib/publicAssets";

const imgLogo = siteImage("logo.png"); // or your user/logo image

export default function AdminSidebar() {
  const location = useLocation();

  const navItem = (to, Icon, label) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
          active
            ? "bg-gray-800 text-yellow-400"
            : "text-yellow-400 hover:bg-gray-800"
        }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#111111] border-r border-gray-800 p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
          <img
            src={imgLogo}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-2xl font-bold text-yellow-400">LIFTLY</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItem("/dashboard", LayoutDashboard, "Dashboard")}
        {navItem("/dashboard/create-user", Users, "Create User")}
        {navItem("/dashboard/users", Users, "Users")}
        {navItem("/dashboard/products", Tag, "Products")}
        {navItem("/dashboard/articles", FileText, "Articles")}
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          // add supabase logout later
        }}
        className="absolute bottom-8 left-6 right-6 bg-yellow-400 text-black font-semibold py-3 px-6 rounded-full hover:bg-yellow-500 transition-colors"
      >
        → Logout
      </button>
    </div>
  );
}
