import { useEffect, useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { logout } from "../features/auth/services/authService";
import { useReminders } from "../features/reminders/hooks/useReminders";
import Sidebar from "../components/common/sidebar/Sidebar";
import "./AppLayout.css";

async function handleLogout() {
  await logout();
}

function AppLayout() {
  const { due } = useReminders();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("techtrack-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("techtrack-theme", theme);
  }, [theme]);

  return (
    <div className="app-layout">
      <header>
        <h1>TechTrack</h1>

        <div className="app-header-actions">
          <Link className="header-reminders" to="/reminders" aria-label={`${due.length} reminders due`} title={`${due.length} reminders due`}>
            <Bell size={17} />
            {due.length > 0 && <span>{due.length > 99 ? "99+" : due.length}</span>}
          </Link>
          <button className="theme-toggle" onClick={() => setTheme(current => current === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <div className="app-body">
        <Sidebar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
