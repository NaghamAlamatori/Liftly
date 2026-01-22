import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function AdminHeader({ title, right }) {
  return (
    <div className="absolute left-[297px] top-[21px] right-[40px] flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" className="h-auto px-6 py-2">
          <Link to="/dashboard">Back</Link>
        </Button>
        <p className="text-[32px] font-normal leading-normal text-primary">{title}</p>
      </div>
      <div className="flex items-center gap-3">{right}</div>
    </div>
  );
}

