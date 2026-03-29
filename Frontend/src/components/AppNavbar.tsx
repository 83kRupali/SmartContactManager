import { Moon, Sun, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface AppNavbarProps {
  darkMode: boolean;
  toggleDark: () => void;
}

const AppNavbar = ({ darkMode, toggleDark }: AppNavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">

        {/* LEFT */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white font-bold text-xs">
            SC
          </div>
          <span className="font-bold">SCM <span className="text-primary">2.0</span></span>
        </div>

        {/* CENTER */}
        <div className="hidden md:block flex-1 max-w-md">
          <h2 className="text-sm font-semibold">Smart Contact Manager</h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* DARK MODE */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-accent"
          >
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* ✅ FIXED LOGOUT */}
          <button
            onClick={handleLogout}
            className="hidden md:flex p-2 rounded-lg hover:bg-accent"
          >
            <LogOut size={18} />
          </button>

          {/* ✅ FIXED MOBILE MENU */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* MOBILE NAV */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-1 bg-card">
          {[
            { title: "Dashboard", path: "/" },
            { title: "Contacts", path: "/contacts" },
            { title: "Add Contact", path: "/contacts/add" },
            { title: "Favorites", path: "/favorites" },
            { title: "Archived", path: "/archived" },
            { title: "Profile", path: "/profile" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm hover:bg-accent"
            >
              {item.title}
            </Link>
          ))}

          {/* ✅ OPTIONAL: Logout in mobile */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default AppNavbar;





