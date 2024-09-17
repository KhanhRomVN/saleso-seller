import React from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  BarChart,
  Store,
  DollarSign,
  RefreshCcw,
  Receipt,
  RotateCcw,
  MessageSquare,
  Settings,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    category: "Main",
    items: [
      {
        path: "/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        text: "Dashboard",
      },
      {
        path: "/analytics",
        icon: <BarChart className="h-4 w-4" />,
        text: "Analytics",
      },
    ],
  },
  {
    category: "Sales",
    items: [
      {
        path: "/product/management",
        icon: <Store className="h-4 w-4" />,
        text: "Products",
      },
      {
        path: "/order/management",
        icon: <DollarSign className="h-4 w-4" />,
        text: "Orders",
      },
      {
        path: "/reversal",
        icon: <RotateCcw className="h-4 w-4" />,
        text: "Reversal",
      },
    ],
  },
  {
    category: "Management",
    items: [
      {
        path: "/feedback",
        icon: <Receipt className="h-4 w-4" />,
        text: "Feedback",
      },
    ],
  },
  {
    category: "Support",
    items: [
      {
        path: "/messages",
        icon: <MessageSquare className="h-4 w-4" />,
        text: "Messages",
      },
    ],
  },
  {
    category: "Settings",
    items: [
      {
        path: "/settings",
        icon: <Settings className="h-4 w-4" />,
        text: "Settings",
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div
      className={`box-border bg-background_secondary flex flex-col fixed inset-y-0 left-0 z-50 w-[230px] transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="h-[61px] flex items-center pl-4">
        <img
          src="https://i.ibb.co/CMSJMK3/Brandmark-make-your-logo-in-minutes-removebg-preview.png"
          alt="logo"
          className="object-cover h-3/5"
        />
        <Button
          variant="ghost"
          className="md:hidden absolute top-2 right-2"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      <Separator />
      <div className="flex h-[calc(100%-61px)]">
        <ScrollArea className="flex flex-col justify-between h-full relative box-border p-3.5 flex-grow">
          <div>
            {menuItems.map((menuItem, index) => (
              <div key={index}>
                <h6 className={`text-xs ${index !== 0 ? "mt-2.5" : "mt-0"}`}>
                  {menuItem.category}
                </h6>
                {menuItem.items.map((item, subIndex) => (
                  <Button
                    key={subIndex}
                    variant="ghost"
                    className={`w-full justify-start px-4 py-1 my-0.5 ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    asChild
                  >
                    <Link to={item.path}>
                      {item.icon}
                      <span className="ml-2 text-sm">{item.text}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            ))}
          </div>
          <div>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-1"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="text-sm">Logout</span>
            </Button>
          </div>
        </ScrollArea>
        <Separator orientation="vertical" />
      </div>
    </div>
  );
};

export default Sidebar;
