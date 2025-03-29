
import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Settings } from "lucide-react";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-16 bg-white border-r flex-shrink-0">
        <div className="fixed h-full w-16 flex flex-col items-center py-6">
          <Link
            to={createPageUrl("Admin")}
            className="p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            title="Configurações"
          >
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
