import React, { useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import Sidebar from "@/components/SideBar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <HeaderBar />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-2.5 md:pl-[240px] md:pt-[70px]">
          <Button
            variant="ghost"
            className="md:hidden fixed top-2 left-2 z-50"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </Button>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
