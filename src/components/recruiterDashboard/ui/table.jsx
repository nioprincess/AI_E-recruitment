// File: src/ui/table.jsx
import React from "react";

export const Table = ({ children, className = "" }) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-border ${className}`}>
      <table className="min-w-full divide-y divide-border">
        {children}
      </table>
    </div>
  );
};
