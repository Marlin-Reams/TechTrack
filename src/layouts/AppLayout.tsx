import { Link, Outlet } from "react-router-dom";
import { logout } from "../features/auth/services/authService";

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
        <nav>
          <Link to="/">Dashboard</Link>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;