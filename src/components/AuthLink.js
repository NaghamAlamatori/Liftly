import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AuthLink({ to, children, ...props }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <Link to="/login" state={{ from: to }} {...props}>
      {children}
    </Link>
  );
}


