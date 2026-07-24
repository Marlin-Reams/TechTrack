import { Outlet } from "react-router-dom";
import { logout } from "../features/auth/services/authService";
import Sidebar from "../components/common/sidebar/Sidebar";

async function handleLogout() {
  await logout();
}

function AppLayout() {
  return (
    <div className="app-layout">
      <header>
        <h1>TechTrack</h1>

        <button onClick={handleLogout}>
          Sign Out
        </button>
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