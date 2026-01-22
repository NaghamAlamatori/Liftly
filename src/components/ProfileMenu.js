import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProfileMenu({ onClose }) {
  const { logout, user } = useAuth(); // Assuming 'user' has { full_name, email }
  const navigate = useNavigate();

  return (
    <div
      className="w-[200px] rounded-[30px] bg-[hsl(var(--figma-text))] px-[20px] py-[20px] shadow-[0px_24px_7px_0px_rgba(0,0,0,0),0px_16px_6px_0px_rgba(0,0,0,0.01),0px_9px_5px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.09),0px_1px_2px_0px_rgba(0,0,0,0.10)]"
      role="menu"
      aria-label="Profile menu"
    >
      {/* User info */}
      {user && (
        <div className="mb-4 border-b border-black/30 pb-4">
          <p className="text-[16px] font-semibold text-black truncate">{user.full_name || "User"}</p>
          <p className="text-[14px] text-black/70 truncate">{user.email}</p>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-col gap-[10px]">
        <Link
          to="/plan/list"
          className="w-fit text-[15px] font-normal leading-[1.1] tracking-[-0.8px] text-black"
          onClick={onClose}
        >
          Saved plans
        </Link>
        <Link
          to="/cart"
          className="w-fit text-[15px] font-normal leading-[1.1] tracking-[-0.8px] text-black"
          onClick={onClose}
        >
          Cart
        </Link>
      </div>

      <div className="mt-[10px] h-px w-full bg-black/30" />

      {/* Logout */}
      <div className="mt-[10px]">
        <button
          type="button"
          className="w-fit text-[15px] font-normal leading-[1.1] tracking-[-0.8px] text-[hsl(var(--brand-2))]"
          onClick={() => {
            logout();
            onClose?.();
            navigate("/login", { replace: true });
          }}
        >
          logout
        </button>
      </div>
    </div>
  );
}
