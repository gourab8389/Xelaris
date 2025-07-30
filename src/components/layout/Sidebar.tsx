import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "../../lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen,  
  Settings,
  X 
} from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { setSidebarOpen } from "../../store/slices/uiSlice";
import type { RootState } from "../../store";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(setSidebarOpen(false))}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};